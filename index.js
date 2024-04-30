const express = require('express');
const app = express();
const dotEnv = require('dotenv');
dotEnv.config();
const PORT = process.env.PORT;


app.get('/',(req,res) => {
   res.status(200).json({message:"Server is running"});
})


app.listen(PORT,() => console.log(`Server Running at http://localhost:${PORT}/`));