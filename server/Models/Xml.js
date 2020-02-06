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
    doc: {
        type: Schema.Types.Mixed
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

Xml.index({proy:1, name:1}, {unique:1});
module.exports = mongoose.model('Xml', Xml);