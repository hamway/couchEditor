/**
 * Created by hamway on 08.07.14.
 */

var config = {
    local: {
        mode: 'local',
        port: 3000,
        enable: true,
        couch: {
            host: 'http://stat.selfhander.com',
            port: 5984,
            auth: {
                username: 'admin',
                password: 'selfhander2014'
            },
            db: 'stats'
        }

    },
    staging: {
        mode: 'staging',
        port: 4000,
        enable: false,
        couch: {
            host: 'http://localhost',
            port: 5984,
            auth: {
                username: '',
                password: ''
            },
            db: ''
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        enable: false,
        couch: {
            host: 'http://localhost',
            port: 5984,
            auth: {
                username: '',
                password: ''
            },
            db: ''
        }
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}
