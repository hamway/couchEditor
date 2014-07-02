var express = require('express');
var router = express.Router();

var cradle = require('cradle');
var db = new(cradle.Connection)('http://stat.selfhander.com', 5984, {auth: {username: 'admin', password: 'selfhander2014'}}).database('stats');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {

    db.get('_all_docs', {startkey: "\"_design\"", endkey: "\"_design0\""}, function(err, doc){
        var design = [];
        if (err) {
            alert(err);
        } else {
            for (var key in doc.rows) {
                design[key] = doc.rows[key]['key']
            }
            res.render('index', { title: 'CouchEditor', all: design });
        }
    });
});

router.get('/docs', function(req,res) {
    var view = req.query.view;
    if (!view) res.send(206);

    db.get(view, function(err,doc) {
        var filename = view.replace('_','').replace('/','_') + '.json';
        console.log(filename);
        fs.readdir('./public/backups', function(err, files) {
            if (err) throw err;
            var exist = false;
            files.forEach(function(file) {
                if (file == filename) {
                    exist = true;
                }
            });

            if (!exist) {
                fs.writeFile('./public/backups/' + filename, doc);
            }
        });
        res.json(200, doc);
    });

});

module.exports = router;
