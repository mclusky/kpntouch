const users = [];
let user;

const addUser = ({
    id,
    username,
    room
}) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username;
    });

    if (existingUser) {
        user = { ...existingUser };
    } else {
        //Store user
        user = {
            id,
            username,
            room
        };
        users.push(user);
    }

    return {
        user
    };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => users.find(user => user.id === id);

const usersInRoom = (room) => users.filter(user => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    usersInRoom
};