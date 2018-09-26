let mongoose = require('mongoose')
let Schema = mongoose.Schema

// Define User Schema
let KeySchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    key_id: {
        type: String,
        require: true
    },
    key: {
        type: String,
        require: true
    },
    fingerprint: {
        type: String,
        require: true
    }
})

let Key = mongoose.model('Key', KeySchema)
Key.collection.dropIndexes()
module.exports = Key
