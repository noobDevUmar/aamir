const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    username:String,
    country:String,
    score:{type:Number,default:0},
    duration:{type:String,default:null}, 
   createdAt: { type: Date, default: Date.now }
    ,level:{type:String,default:'1'},

})

module.exports = mongoose.model('userScores',Schema)