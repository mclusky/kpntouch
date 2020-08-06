const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        requied: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    imagePath: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    group: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Group'
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;