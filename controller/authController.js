const userSchema = require('../model/userModel.js');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { verifyToken } = require('./authVerifyUser.js');
const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: 'nagaraj516700@gmail.com',
      pass: 'bgxm fbbf gofe rlbp'
   }
})
function mailSender(email, name) {
   let mailOptions = {
      from: 'Company-XYZ <nagaraj516700@gmail.com>',
      to: email,
      subject: "Signup Successful",

      html: `
        <h2>Dear ${name},</h2>
        <h4><strong>Welcome Mr. ${name},</strong></h4>
        <p>Your account has been successfully created.</p>
        <p>Thank you for joining us!</p>
        <p>Best regards,<br>Company-XYZ</p>
    `
   };
   transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
         console.error('Error sending email:', error);
      } else {
         console.log('Email sent:', info.response);
      }
   })
}

async function emailValidationChecker(email) {
   try {
      const key = process.env.EMAIL_VALIDATE_API_KEY;
      const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${email}`);
      console.log(response.data.deliverability)
      console.log(response.data.deliverability == "DELIVERABLE")
      return response.data.deliverability == "DELIVERABLE"
   }
   catch (error) {
      return false;
   }
}
async function registerUser(req, res) {
   // const data = await userSchema.find();
   try {
      console.log(req.body)
      const isValid = await emailValidationChecker(req.body.email);
      console.log("isvalid", isValid)
      if (!isValid) {
         console.log("isvalid", isValid)
         return res.status(400).json({ message: "Email is not valid" });
      }
      const userData = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(req.body.password, salt);
      userData.password = hashPassword;
      userData.createdAt = new Date(Date.now());
      const newUser = new userSchema(userData)
      console.log(newUser);
      await newUser.save();

      mailSender(newUser.email, newUser.name);
      res.status(200).json({ message: "Register Successfull", data: newUser });


   }
   catch (error) {
      if (error.errorResponse.code) {
         return res.status(400).json({ message: "Account already exist", error: error })
      }

      res.status(500).json({ message: "Server Crashed", error: error });
   }


}

async function loginUser(req, res) {
   console.log(req.body)
   const userByName = await userSchema.findOne({ username: req.body.emailorusername });
   const userByEmail = await userSchema.findOne({ email: req.body.emailorusername });
   let user = userByEmail || userByName;
   console.log(user)

   if (!user) {
      console.log("Accound doesn't exist");
      return res.status(400).json({ message: "Account doesn't Exist" })
   }
   const userData = {
      userName: user.username,
      name: user.name,
   }
   const correctPassword = await bcrypt.compareSync(req.body.password, user.password);
   if (!correctPassword) {
      return res.status(400).json({ message: "Invalid Password." });
   }
   const token = jwt.sign(
      {
         id: user._id,
         role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
         expiresIn: "1h"
      }
   );

   res.cookie('accesstoken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(Date.now() + 600000),
      partitioned: 'None'

   }).status(200).json({ message: "Login Success", data: userData, token: token });

}

async function resetPassword(req, res) {
   console.log(req.body);
   console.log(req.headers.token)
   try {
      const data = verifyToken(req.headers.token);
      console.log(data)
      if (data) {
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(req.body.newpassword, salt)
         console.log(hash);
         const userData = await userSchema.findById(data.id);
         if(userData){
            const correctPassword = await bcrypt.compareSync(req.body.oldpassword, userData.password);
            if(!correctPassword){
               return res.status(400).json({message:'Old password is incorrect'});
            }
            const updatePassword = await userSchema.findByIdAndUpdate(data.id,{password:hash},{new:true})
         console.log(updatePassword)
         return res.status(200).json({ message: 'Updated Successfully!',data:updatePassword });
         }
         return res.status(200).json({message:'User must login'});
      }
      res.status(400).json({ message: 'Not Updated..' })
   }
   catch (error) {
      res.status(500).json({ message: 'Server Chrashed..' })
   }
}

module.exports = { registerUser, loginUser, resetPassword };