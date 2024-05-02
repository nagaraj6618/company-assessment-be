const express = require('express');
const { loginUser, registerUser, resetPassword } = require('../controller/authController');
const router  = express.Router();

router.post('/login',loginUser);
router.post('/signup',registerUser);
router.post('/password-reset' ,resetPassword);

module.exports = router;