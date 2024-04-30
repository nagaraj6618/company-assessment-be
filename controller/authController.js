const userSchema = require('../model/userModel.js');
const bcrypt = require('bcryptjs');
const axios = require('axios');

async function emailValidationChecker (email){
   try{
   const key = process.env.EMAIL_VALIDATE_API_KEY;
   const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${email}`);
   console.log(response.data.deliverability)
   return response.data.deliverability == "DELIVERABLE"
   }
   catch(error){
      return false;
   }

   
}
async function registerUser (req,res) {
   // const data = await userSchema.find();
   try{
      const isValid = await emailValidationChecker(req.body.email);
      if(!isValid){
         return res.status(400).json({message:"Email is not valid"});
      }
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