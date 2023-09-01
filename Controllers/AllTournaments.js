const TournamentModel = require('../Model/Tournaments')
const userScoresModel = require('../Model/userScores')
const Dynamic = require('../MaintainableFile')
const userModel = require('../Model/Users')
const TournamentInviatationModel= require('../Model/InvitationModel')
const InvitationModel = require('../Model/InvitationModel')



//  TO BE REFRACTOR 


exports.startATournament = async(req,res)=>{

  const { username, level, createdAt,duration,receivers } = req.body;
console.log(req.body);

const Added=[]

  const expire = new Date(createdAt);
  expire.setDate(expire.getDate() +duration);
  



// Criteria's 


                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Last 7 Days Filter
                    
                    // Check if the host has started a tournament in the last 7 days
                    const UserStartedTournament = await TournamentModel.find({
                      username,
                      createdAt: { $gte: sevenDaysAgo }
                    });


                  // Aggregate His Total Scores
                  let UserAggregatedScore = 0
                  const test =await userScoresModel.find({username})
                  test.map((item)=>{
                  
                    UserAggregatedScore  += item.score
                  })

                  let AtLeastScore = Dynamic.Criteria2AtLeastScores   // user should have at least this score




  
  // check if the user has started 1 tournament
  if (UserStartedTournament.length === 0) {
   // Create the tournament and wait for it to be created
 const tournament =   await TournamentModel.create({
    username,
    level,
    createdAt,
    duration,
    ExpireAt:expire,
  });
console.log(tournament._id.toString());

receivers.map(async(item)=>{

  const check = await userModel.find({username:item})

if(check.length==0){
  console.log(check);
  
}else{
// its not waiting for this because tis async
  Added.push(check[0]?.username)
  await TournamentInviatationModel.create({sender:username,receiver:item,TournamentId:tournament._id.toString()})
}

})

  res.json({status:"successs",addedPeople:Added})

  } else if(UserStartedTournament.length === 1){

        // check for criteria 2
      if(UserAggregatedScore>AtLeastScore){
        const tournament =   await TournamentModel.create({
          username,
          level,
          createdAt,
          duration,
          ExpireAt:expire,
        });
      console.log(tournament._id.toString());
      
      receivers.map(async(item)=>{
      
        const check = await userModel.find({username:item})
      
      if(check.length==0){
        console.log(check);
        
      }else{
      // its not waiting for this because tis async
        Added.push(check[0]?.username)
        await TournamentInviatationModel.create({sender:username,receiver:item,TournamentId:tournament._id.toString()})
      }
      
      })
      
        res.json({status:"successs tournament2",addedPeople:Added})
        
      }else{
        
        res.json({error : `You Need To At least score ${Dynamic.Criteria2AtLeastScores} to start second Tournament ` })
      
      
      }

  }
  
  
  else if(UserStartedTournament.length >=2 ){
    
    res.json({ message: "Sorry , You have reached tournament Limit" });
  }
  

}




exports.CheckIfTournamentIsExpired = async(req,res)=>{

    const {TournamentId,time}= req.body


     const db = await TournamentModel.find({TournamentId})

     res.json(db)





}




// // Aamir will send me username here
// exports.ConfirmUser = async(req,res)=>{
//     const {username}= req.body
//     // replace UserModel
//    const check=  await userModel.find({username:username})
//    console.log(check);
//     if(check.length>0){
//         res.status(200).json({
//             message:"Yes , Available"
//         })
//     }else{
//         res.status(404).json({
//             message:"No , user is not Available"
//         })
//     }

// }



// have to work on this At HOME
exports.SendInviteToUsers = async(req,res)=>{

  const {username,receivers,TournamentId} = req.body
  
  
receivers.map(async(item)=>{

    const check = await userModel.find({username:item})

if(check.length>0){

   await TournamentInviatationModel.create({sender:username,receiver:item,TournamentId})
   console.log("Added");
}
})
res.json({message:"Users Added"})

}


exports.CheckMyInvites  = async(req,res)=>{
  const {username} = req.body

  const check = await InvitationModel.find({ receiver: username ,status:"pending"});
  let senders = [];
  
  check.map((item) => {
    senders.push({
      sender: item.sender,
      TournamentId: item.TournamentId
    });
  });
  
  res.json(check);
}




exports.rejectAnInvitation= async(req,res)=>{


  const { username, TournamentId , response } = req.body;

  // Find the record with the specified conditions
  const query = { receiver: username, TournamentId, status: "pending" };
  
  let update=null
  // Update the status to "rejected"
  if(response==='rejected'){
     update = { $set: { status: "rejected" } };
  }else{
    update = { $set: { status: "acepted" } };
  }
  
  // Use findOneAndUpdate to find and update the record
  const updated = await InvitationModel.findOneAndUpdate(query, update, { new: true });
  
  if (updated) {
    // The record was found and updated
    res.json(updated);
  } else {
    // No matching record was found
    res.status(404).json({ message: "No matching record found" });
  }
}







