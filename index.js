const express = require('express');
const app = express();
const dotEnv = require('dotenv');
dotEnv.config();
const mongoose = require('mongoose');
const cors = require('cors')
const userRoute = require('./route/userRoute.js')
const postRoute = require('./route/getPost.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Declaring port number of the server
const PORT = process.env.PORT;

//Middleware
app.use(express.json());//parse incomming payload.
app.use(cors({ origin: true, credentials: true })); // Enable cors for all origin.
app.use(cookieParser());   
app.use(bodyParser.json());

//Making connection with Mongodb 
function mongoDBConnection () {
   try{
      mongoose.connect(process.env.MONGODB_URL)
      //If connection successfull the db will connect
      .then(()=> console.log("MongoDb Connected.."))

      //if the connection is not successfyll then the db will not connect and throws error
      .catch((error)=>console.log("Error Occured while mongodb is connecting:\n",error))
      ;
   }
   catch(error){
      console.log("Error message",error);
   }
}
//Calling the function to connect with mongodb
mongoDBConnection();




//Checking the server is working or not with the help of the get method.
app.get('/',(req,res) => {
   res.status(200).json({message:"Server is running"});
   
})
app.get('/image',(req,res) => {
   console.log(`${__dirname}/assets/avatar.jpeg`)
   res.status(200).sendFile(`${__dirname}/assets/avatar.jpeg`)
})

app.use('/api/v1/auth',userRoute);
app.use('/api/v1/post',postRoute);

app.listen(PORT,() => console.log(`Server Running at http://localhost:${PORT}/`));