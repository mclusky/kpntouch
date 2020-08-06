const express = require('express');
const router = new express.Router();
const groupController = require('../controllers/group');
const auth = require('../middleware/auth');
const { groupValidators } = require('../middleware/validators');

router.get('/:topic', auth, groupController.getGroupsByTopic);

router.get('/single/:id', auth, groupController.getGroupById);

router.post('', auth, groupValidators, groupController.createGroup);

router.patch('', auth, groupValidators, groupController.updateGroup);

router.delete('/:id', auth, groupController.deleteGroup);
module.exports = router;