var http = require('http');
var chat = {};
var io = require('socket.io')();
chat.io = io;

io.on('connection', function(socket) {
    console.log("Someone connected");
    socket.nick = "Anonymous";

    socket.on('NICK', function(nickname) {
        socket.nick = nickname;
        // Need to broadcast this to everyone else somehow
    });

    socket.on('text message', function(message) {
        console.log("Received message:" +message.message);
        io.emit('text message', message);
    });
});

module.exports = chat;
