var mongoose = require('mongoose');
var Schema = mongoose.Schema

// Define User Schema
var User = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    }
})

module.exports = mongoose.model('User', User)
