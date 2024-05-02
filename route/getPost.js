const express = require('express');
const { getAllPost } = require('../controller/PostController');
const { verifyUser } = require('../controller/authVerifyUser');
const router = express.Router();

router.get('/',verifyUser,getAllPost);

module.exports = router;