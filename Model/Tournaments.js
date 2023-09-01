const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    
    username:String, // Host 
   level:String,
   createdAt:Date,
   Duration:Number,
   ExpireAt:Date,
   isActive:{type:String,default:'active'},
})

module.exports = mongoose.model('Tournaments',Schema)