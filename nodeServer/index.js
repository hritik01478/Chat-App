// first satr node index on terminal
// just golive from index.html-> to run this website


// Node server which will handle socket io connection
const io = require('socket.io')(8000, {
    cors: {
        origin: "*"
    }
});

const users = {};

io.on('connection', socket => {

    // If any new user joins, let other users know
    socket.on('new-user-joined', nam => {
        // console.log('new-user ', name);
        users[socket.id] = nam;
        socket.broadcast.emit('user-joined', nam);
    })

    // If someone sends a message, bradcast it to other people 
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] })
    })

    // If any user leaves, let other users know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});
