const mongoose = require('mongoose')

require('dotenv').config()

const connectDB = async () => {
  await mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("Conencted");

}

// if(process.env.PORT){

//   const start = async () => {
//     try {
//       await DBConnect(process.env.URI)
//       app.listen(3000,()=>{
//         console.log("Connected");
//       })
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   start()
  
// }

module.exports = connectDB