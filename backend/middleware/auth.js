const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!user) {
            throw new Error();
        }
        //Adding properties to the request object before next is called
        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({ error, message: 'Authentication failed' });
    }
};

module.exports = auth;