const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const img = require('../middleware/file');
const postController = require('../controllers/post');


router.post("", auth, img.sortFile, img.resize, postController.createPost);

router.get('/:groupId', postController.getPosts);

router.get('/single/:postId', postController.getSinglePost);

router.patch('/:id', auth, img.sortFile, img.resize, postController.updatePost);

router.delete('/:id', auth, postController.deletePost);

module.exports = router;