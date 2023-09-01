const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    TournamentId:ObjectId,
    username:String,
    level:String,
    usercountry:String,
    score:{type:Number,default:0},
    duration:{type:String,default:null},   
     createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('TournamentScores',Schema)