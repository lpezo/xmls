var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Xml = new Schema({
    user: {
        type: mongoose.Types.ObjectId
    },
    proy: {
        type: mongoose.Types.ObjectId,
        index: true
    },
    name: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'ok'
    }
});

module.exports = mongoose.model('Xml', Xml);