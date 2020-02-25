var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let System = new Schema({
    id: {
        type: Number
    },
    tick: {
        type: Boolean
    },
    time: {
        type: Date
    }
});

module.exports = mongoose.model('System', System);