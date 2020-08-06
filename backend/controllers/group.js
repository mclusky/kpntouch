const Group = require('../models/group');
const filter = require('express-validator');

exports.createGroup = async (req, res) => {
    const group = new Group({
        ...req.body,
        creator: req.user._id,
        admin: req.user.username
    });

    try {
        const g = await group.save();
        res.status(201).send({ group: g, message: 'Group Created' });
    } catch (error) {
        res.status(500).send({ error, message: 'Failed to create group' });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const group = await Group
            .findByIdAndUpdate(req.body._id, req.body, { new: true });

        if (!group) {
            return res.status(406).send({ message: 'Could not update the group.' });
        }
        res.status(200).send({ group, message: 'Group updated successfuly' });
    } catch (error) {
        res.status(500).send({ error, message: 'Failed to update group.' });
    }
};

exports.getGroupsByTopic = async (req, res) => {
    try {
        const topic = req.params.topic;
        const { pageNumber, pageSize } = req.query;
        const count = await Group.find({ topic }).countDocuments();
        const groups = await Group
            .find({
                $text: {
                    $search: topic
                }
            })
            .select('-creator')
            .skip((+pageNumber - 1) * (+pageSize / 2))
            .limit(+pageSize)
            .populate('members')
            .exec();
        res.status(200).send({ groups, count });

    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getGroupById = async (req, res) => {
    const groupId = req.params.id;
    try {
        const group = await Group.findById(groupId).populate('members').exec();
        const count = await Group.find({ topic: group.topic }).countDocuments();
        if (!group) {
            return res.status(404).send({ message: 'Could not find the group you\'re looking for.' });
        }
        res.status(200).send({ group, count });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        // Confirm Onwership before deleting
        const group = await Group.findById(req.params.id);
        if (group.creator.toString() !== req.user._id.toString()) {
            return res.status(401).send({ message: 'You are not authorized to perform that action' });
        }
        const deletedGroup = await Group.findByIdAndRemove(req.params.id);
        if (!deletedGroup) {
            return res.status(404).send({ message: 'Could not find group to delete' });
        }
        res.status(200).send({ group: deletedGroup });
    } catch (error) {
        console.log(error);

        res.status(500).send(error);
    }
}