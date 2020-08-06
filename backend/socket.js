const socketio = require('socket.io');
const Filter = require('bad-words');

const {
    addUser,
    removeUser,
    getUser,
    usersInRoom
} = require('./utils/user');

// INIT SOCKET IO
exports.socket = function(server) {
    const io = socketio(server, {
        pingTimeout: 60000
    });
    io.on('connection', (socket) => {

        socket.on('join', ({ username, room }, cb) => {
            const { user } = addUser({
                id: socket.id,
                username,
                room
            });
            // Add user to the room
            socket.join(user.room);
            // Tell the room a user has joined the chat
            socket.broadcast.to(user.room).emit('userJoin', `${user.username} has joined the group chat`);
            const users = usersInRoom(user.room).length;
            io.to(user.room).emit('roomData', users);
            cb();
        });

        // When user sends a message 
        socket.on('sendMessage', ({ msg, swearing }, cb) => {
            const user = getUser(socket.id);
            // Check if swearing is allowed in group and clean msg if not
            if (!swearing) {
                const filter = new Filter();
                msg = filter.clean(msg);
            }
            io.to(user.room).emit('userMsg', { username: user.username, msg });
        });

        socket.on('leave', (room) => {
            socket.leave(room);
            const user = removeUser(socket.id);
            if (user) {
                const users = usersInRoom(room).length;
                io.to(user.room).emit('userLeft', `${user.username} has left the room!`);
                io.to(user.room).emit('roomData', users);
            }
        });

        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            if (user) {
                const users = usersInRoom(user.room).length;
                io.to(user.room).emit('userLeft', `${user.username} has left the room!`);
                io.to(user.room).emit('roomData', users);
            }
        });
    })
};