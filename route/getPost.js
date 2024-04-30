const express = require('express');
const { getAllPost } = require('../controller/PostController');
const router = express.Router();

router.get('/',getAllPost);

module.exports = router;