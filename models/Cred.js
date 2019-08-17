const mongoose = require('mongoose');

const CredSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    }
}, { collection: 'users'});

const Cred = mongoose.model('User', CredSchema);
module.exports = Cred;