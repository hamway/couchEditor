var express = require('express');
var router = express.Router();

var config = require('../config')();

var cradle = require('cradle');
var db = new(cradle.Connection)(config.couch.host, config.couch.port, {auth: config.couch.auth}).database(config.couch.db);

var fs = require('fs');
var utils = require('util');

/* GET home page. */
router.get('/', function(req, res) {
    if(config.enable == false) {
        res.render('close', { title: 'CouchEditor closed.'});
    } else {
        db.get('_all_docs', {startkey: "\"_design\"", endkey: "\"_design0\""}, function(err, doc){
            var design = [];
            if (err) {
                alert(err);
            } else {
                for (var key in doc.rows) {
                    design[key] = doc.rows[key]['key']
                }
                res.render('index', { title: 'CouchEditor', all: design, source: config.couch.db });
            }
        });
    }
});

router.get('/docs', function(req,res) {
    var view = req.query.view;
    if (!view) res.send(206);
    if(view == 0) res.send(200, {});

    db.get(view, function(err,doc) {
        res.json(200, doc);
    });
});

router.get('/docs/load', function(req,res) {
    db.get('_all_docs', {startkey: "\"_design\"", endkey: "\"_design0\""}, function(err, doc){
        var design = [];
        if (err) {
            alert(err);
        } else {
            for (var key in doc.rows) {
                design[key] = doc.rows[key]['key']
            }
            res.send(200, design);
        }
    });
});

router.post('/docs/backup', function(req,res) {
    db.get('_all_docs', {startkey: "\"_design\"", endkey: "\"_design0\""}, function(err, doc){
        var filename = './public/backups/' + convertName('backups');
        var exists = fs.existsSync(filename);

        if (!exists) {
            writeToEmpty(filename, doc);
            res.send(200);
        } else {
            fs.readFile(filename, 'utf-8', function(err,data) {
                if(err) throw err;
                if (data.length == 0) {
                    writeToEmpty(filename,doc);
                    res.send(200);
                } else {
                    updateFile(filename,doc,data);
                    res.send(200, 'Update');
                }
            });
        }
    });
});

router.post('/docs/restore', function(req,res) {
    if (req.body.database) {
        var newdb = new (cradle.Connection)('http://stat.selfhander.com', 5984, {auth: {username: 'admin', password: 'selfhander2014'}}).database(req.body.database);
        fs.readdir('./public/backups/views', function(err, files) {
            for(var key in files) {
                var file = files[key];
                if (file.indexOf('.json') > -1) {
                    var viewName = convertView(file);
                    var model = fs.readFile('./public/backups/views/' + file, 'utf-8', function(err,data) {
                        data = JSON.parse(data);
                        var id = data._id;
                        delete data._id;
                        delete data._rev;
                        newdb.save(id, data);
                    });
                }
            }
        });
        res.send(200);
    } else {
        res.send(404);
    }
});

module.exports = router;


/** Functions */

function convertName(name, ext) {
    if (ext != false) {
        if (!ext) ext = 'json';
        ext = '.' + ext;
        return name.replace('_','').replace('/','_') + ext;
    } else {
        return name;
    }
}

function convertView(name) {
    var name = name.split('.')[0];
    return name.replace('design_','_design/');
}

function writeToEmpty(filename, doc) {
    var data = {};
    for (var key in doc) {
        var view = convertName(doc[key].key, false);
        var rev = doc[key].value.rev;

        data[view] = rev;
    }

    fs.writeFileSync(filename,doc);
}

function updateFile(filename, doc,data) {
    for (var key in doc) {
        var view = convertName(doc[key].key, false);
        var rev = doc[key].value.rev;
        var bkpfile = './public/backups/views/' + convertName(view);

        if (data[view] != rev || !fs.existsSync(bkpfile)) {
            db.get(view, function(err, newdoc) {
                var writeFile = './public/backups/views/' + convertName(newdoc.id);
                fs.writeFileSync(writeFile, newdoc);
            });
        }
    }

    fs.writeFileSync(filename,doc);
}