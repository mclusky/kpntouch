const User = require('../models/user');
const Group = require('../models/group');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../emails/account');
const { trim } = require('jquery');

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(406).send({ message: errors.array()[0].msg });
    }
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({
            _id: user._id,
            username: user.username,
            groupsJoined: []
        });
    } catch (err) {
        res.status(500).send({
            message: "Invalid credentials"
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User
            .findByCredentials(req.body.email, req.body.password);
        const token = await user.authToken();
        const userGroups = await Group.find({ creator: user._id });

        res.status(200).send({
            auth: {
                token,
                token_expiration: 3600,
                userId: user._id,
                username: user.username,
            },
            user: {
                groupsJoined: user.groupsJoined,
                userGroups
            }
        });

    } catch (error) {
        res.status(500).send({ message: 'Invalid credentials' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(item => item.token !== req.token);
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const user = req.user;
        const group = await Group.findById(req.body.groupId);
        if (group && (user.groupsJoined.indexOf(group._id) === -1)) {
            await user.addGroup(group);
            return res.status(202).send(group);
        }
        res.status(406).send({ message: 'You already have joined this group' });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getGroupsJoined = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const groups = user.groupsJoined;

        res.status(200).send(groups);
    } catch (error) {
        res.status(500).send({ message: error });
    }
};

exports.leaveGroup = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const group = await Group.findById(req.body.groupId);
        if (!group) {
            return res.status(404).send({ message: 'Group not found' })
        }
        await user.removeGroup(group);
        res.status(200).send({ message: 'Group successfuly removed', group });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

exports.forgot = async (req, res) => {
    //Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({ message: 'Can not find User' });
    }
    // Set reste token
    user.resetToken = crypto.randomBytes(20).toString('hex');
    user.resetTokenExpires = Date.now() + 3600000;
    await user.save();
    //Send Email with token
    const URL = `http://${req.headers.host}/api/users/reset/${user.resetToken}`;
    await sendEmail(user.email, 'Password Reset Token', `You have requested a password reset. Click the following link to reset your password : ${URL}`);
    res.status(200).send();
}

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetToken: req.params.token,
        resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(500).send({ message: 'Password reset failed' });
    }
    res.status(200).redirect(`http://localhost:4200/reset-password/${req.params.token}`);
}

exports.resetPassword = async (req, res) => {
    const user = await User.findOne({
        resetToken: req.body.resetToken,
        resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(404).send({ message: 'The reset token does not exist' });
    }

    // Save new Password
    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).send({ message: 'Password updated successfully' });

}