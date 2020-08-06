const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true,
    },
    swearingAllowed: {
        type: Boolean,
        required: true
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    admin: {
        type: String,
        required: true
    },
    postsLoaded: {
        type: Boolean
    }
}, {
    toJSON: {
        virtuals: true
    }
}, {
    timestamps: true
});

// Create and define index 
groupSchema.index({
    topic: 'text'
});

groupSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'group'
});

groupSchema.virtual('members', {
    ref: 'User',
    localField: '_id',
    foreignField: 'groupsJoined',
    count: true
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;