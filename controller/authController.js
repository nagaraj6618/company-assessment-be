const userSchema = require('../model/userModel.js');

async function registerUser (req,res) {
   const data = await userSchema.find();
   console.log(req.body);
   res.status(200).json({message:"Register Method",data:data});

}

async function loginUser (req,res) {
   res.status(200).json({message:"Login Method."});
}

module.exports = {registerUser,loginUser};