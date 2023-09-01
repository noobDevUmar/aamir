const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    
    sender:String,
    receiver:String,
    TournamentId:String,
    status:{type:String,default:'pending'},
    timestamp:Date
})

module.exports = mongoose.model('invitations',Schema)