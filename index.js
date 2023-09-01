const express =require('express')
const app = express();
const DBConnect = require('./db')
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
const querystring = require('querystring');
app.use(express.text()); // This is for parsing JSON data

const {createAccount,StoringScores, AllUsers} = require('./Controllers/Users')
const {GlobalTop10,CountryTop10} = require('./Controllers/LeaderboardData')
const{startATournament, ConfirmUser,SendInviteToUsers, CheckMyInvites, rejectAnInvitation, acceptAnInvitation} = require('./Controllers/AllTournaments')

DBConnect()
app.listen(3000)
const test =[]
test.push("Suii")

// const date = new Date('2023-08-29T12:09:22.351Z');
// var numberOfDaysToAdd = 3; // Example number of days
// date.setDate(date.getDate() + numberOfDaysToAdd);

// console.log(date);
console.log(test);




  // refractored!
  
  // users
  app.post('/createaccount',createAccount)
  app.post('/user/highscore',StoringScores)
  app.get('/allusers',AllUsers)
  
  //leaderboard
  app.post('/leaderboard/country',CountryTop10)
  app.get('/leaderboard/global',GlobalTop10)



  // Tournament
  app.post('/tournament/start',startATournament)



// app.post('/tournament/userverify',ConfirmUser)
app.post('/tournament/sendinvite',SendInviteToUsers)


//DONE 
app.post('/tournament/myinvites',CheckMyInvites)
app.post('/tournament/checkinvitation',rejectAnInvitation)




app.post('/testing',(req,res)=>{

   // decoding 

  //  const textPlainData = req.body;
  
  //  // Decode the URL-encoded data
  //  const decodedData = decodeURIComponent(textPlainData);
   
  //  // Parse the decoded data into a JSON object
  //  const jsonData = querystring.parse(decodedData);
   
  //  const { username, level, createdAt,duration,receivers }  = jsonData;

    const { username, level, createdAt,duration,receivers }  = req.body;

  console.log(req.body);
})


// app.post('/tournamentExpired',CheckIfTournamentIsExpired)

  module.exports= app
