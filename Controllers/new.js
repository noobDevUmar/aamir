
const TournamentModel = require('../Model/Tournaments')

async function Check(req,res){
    const { username, level, createdAt,duration } = req.body;
    // Create the tournament and wait for it to be created
const check =    await TournamentModel.create({
    username,
    level,
    createdAt,
    duration,
    ExpireAt:expire,
  });

let tID = check._id

// const {username,receivers,TournamentId} = req.body
  
  
receivers.map(async(item)=>{

        // Tournament Invitation Model

    await TournamentInviatationModel.create({sender:username,receiver:item,tID})

})

res.status(200).json({message:"All users added Successfully"})
  
}

