const express = require('express');
require('./db/mongoose');
const app = express();
const postsRoutes = require('./routers/posts');
const userRoutes = require('./routers/user');
const groupsRoutes = require('./routers/group');
const topicsRoutes = require('./routers/topics');
const path = require('path');

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/", express.static(path.join(__dirname, "kit")));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Request-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/topics', topicsRoutes);
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'kit', 'index.html'));
});

module.exports = app;