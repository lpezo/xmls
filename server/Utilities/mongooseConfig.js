var mongoose = require('mongoose');
mongoose.set('debug', true);
var config = require("../Utilities/config").config;

module.exports = function() {
    mongoose.Promise = global.Promise;
    var db = null;
    if (config.DB_URL.user != 'null'){
        console.log(config.DB_URL);
        mongoose.connect(config.DB_URL.url, { 
            useNewUrlParser: true,
            auth: {
                user: config.DB_URL.user,
                password: config.DB_URL.pwd
              }  
        });
        
    }
    else
        mongoose.connect(config.DB_URL.url, { useNewUrlParser: true });
    require('../Models/User');
    return db;
};