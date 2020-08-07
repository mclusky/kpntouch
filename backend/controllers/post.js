const Post = require('../models/post');
const fs = require('fs');

exports.createPost = async (req, res) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: `${url}/images/${req.body.image}`,
        group: req.body.group,
        author: req.user._id,
    });
    try {
        await post.save();
        res.status(201).send({
            message: 'Post created',
            post
        });
    } catch (err) {
        res.status(400).send({ message: 'Failed to create post' });
    }
};

exports.getPosts = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize);
    const currentPage = parseInt(req.query.currentPage);

    try {
        const posts = await Post.find({ group: req.params.groupId }, null, {
            skip: (pageSize * (currentPage - 1)),
            limit: pageSize
        });
        if (!posts) {
            return res.send({ posts: [] });
        }
        res.send({ posts });
    } catch (err) {
        res.status(500).send({ message: 'Could not fetch posts' });
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }
        res.send(post);
    } catch (err) {
        res.status(500).send({ message: 'Failed to fetch post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        let imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get("host");
            imagePath = `${url}/images/${req.body.image}`;
        } else {
            imagePath = req.body.image;
        }
        const updatedPost = {
            title: req.body.title,
            content: req.body.content,
            imagePath,
            author: req.body.author
        };
        const post = await Post.findByIdAndUpdate({
            _id: req.params.id,
            author: req.body.author
        }, updatedPost, { new: true });
        if (!post) {
            return res.status(401).send({ message: 'Not authorized' });
        }
        res.status(200).send(post);
    } catch (err) {
        res.status(500).send({ message: 'Failed to update post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove({ _id: req.params.id, author: req.userId });
        if (post) {
            const path = post.imagePath.split('/').pop();
            fs.unlink(`./backend/images/${path}`, (err) => {
                if (err) throw err;
            });
        }
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }
        res.send({ post, message: 'Post deleted' });
    } catch (err) {
        res.status(500).send({ message: 'Failed to delete post' });
    }
};