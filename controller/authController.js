const userSchema = require('../model/userModel.js');
const bcrypt = require('bcryptjs');

async function registerUser (req,res) {
   // const data = await userSchema.find();
   try{
      const userData = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(req.body.password,salt);
      userData.password = hashPassword;
      const newUser = new userSchema(userData)
      console.log(newUser);
      await newUser.save();
      res.status(200).json({message:"Register Successfull",data:newUser});
      

   }
   catch(error){
      if(error.errorResponse.code){
         return res.status(400).json({message:"Account already exist",error:error})
      }
      
      res.status(500).json({message:"Server Crashed",error:error});
   }
   

}

async function loginUser (req,res) {
   res.status(200).json({message:"Login Method."});
}

module.exports = {registerUser,loginUser};