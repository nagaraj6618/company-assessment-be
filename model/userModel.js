const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

   username:{
    type:String,
    require:true,
    unique:true  
   },

   email:{
      type:String,
      require:true,
      unique:true,
   },

   password:{
      type:String,
      require:true,
   },
   name:{
      type:String,
   },
   photo:{
      type:String,
   },
   role:{
      type:String,
      default:'user',
   },
   createdAt:{
      type:String,
      require:true
   }

})

module.exports = mongoose.model('user',userSchema);

