const express = require('express');
const { loginUser, registerUser } = require('../controller/authController');
const router  = express.Router();

router.get('/login',loginUser);
router.get('/register',registerUser);

module.exports = router;