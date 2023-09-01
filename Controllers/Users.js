const userModel = require('../Model/Users')
const userScores = require('../Model/userScores')


/*{
 This Page Contains
 
>> CreateAccount 
>> Storing Score 
>> AllUsers

}*/


const createAccount = async (req, res) => {


try {

    const { username, email, country, name } = req.body;
    const check = await userModel.findOne({ username })
    if (!check) {
        await userModel.create({ username, email, country, name })
        res.json({ message: "User Created!" }).status(200)
    } else {
        return res.json({ message: "User Already Exists" }).status(401)
    }

} catch (error) {
    res.json({error:"error"}).status(500)
    console.log("Error Here in create Account");
}

   
}



const StoringScores= async(req,res)=>{
 try {
    
    const { username, score ,duration,level,createdAt} = req.body;


    const UserExists = await userModel.findOne({ username });
    if (!UserExists) {
        return res.status(404).json({ error: 'User Does not exists ' });
      }
      const country = UserExists.country;
      const result =  await userScores.create({ username,score,country,createdAt,duration,level});
      res.json({message:"Scores Successfully Saved!"})


 } catch (error) {
    res.json({error:"error"}).status(500)
    console.log(error);
 }
    
}



const AllUsers = async(req,res)=>{
    try {
        

            return res.json(await userModel.find({}))



    } catch (error) {
        console.log(error);
        res.json({error:"error"}).status(500)
    }
}
    module.exports = { createAccount,StoringScores,AllUsers }