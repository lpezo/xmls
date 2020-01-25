var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let User = new Schema({
    id: {
        type: Number,
        required: true
    },
    user: {
        type: String
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

User.index({ user: 1, name: 1});

module.exports = mongoose.model('Proy', User);
