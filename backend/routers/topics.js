const express = require('express');
const router = new express.Router();
const topicController = require('../controllers/topic');
const auth = require('../middleware/auth');

router.get('', auth, topicController.getTopics);

module.exports = router;