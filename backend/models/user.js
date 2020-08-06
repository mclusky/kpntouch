const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('./post');
const Group = require('./group');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    groupsJoined: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Group'
    }],
    avatar: {
        type: Buffer
    },
    resetToken: String,
    resetTokenExpires: Date
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator);

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.authToken = async function() {
    const token = jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.JWT_KEY, {
        expiresIn: '1 hour'
    });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

userSchema.methods.addGroup = async function(group) {
    this.groupsJoined = this.groupsJoined.concat(group)
    await this.save()
}

userSchema.methods.removeGroup = async function(group) {
    this.groupsJoined = this.groupsJoined.filter(g => g.toString() !== group._id.toString());
    await this.save();
}

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    // delete userObject.avatar;
    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User
        .findOne({ email })
        .populate({
            path: 'groupsJoined'
        });
    if (!user) {
        throw new Error('Unable to login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Unable to login');
    }
    return user;
};

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

//Delete posts and groups when removing user
userSchema.pre('remove', async function(next) {
    await Group.deleteMany({
        creator: this._id
    });
    await Post.deleteMany({
        owner: this._id
    })
    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;