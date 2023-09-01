const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    username:String,
    email:String,
    country:String,
     createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Users',Schema)