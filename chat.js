var http = require('http');
var chat = {};
var io = require('socket.io')();
chat.io = io;

var roomList = [];

io.on('connection', function(socket) {
    console.log("Someone connected");
    socket.nick = "Anonymous";
    socket.room = "chat";
    socket.emit('room list', roomList);

    socket.on('NICK', function(nickname) {
        var old = socket.nick;
        socket.nick = nickname;
        io.emit('NICK', {oldNick: old, newNick: nickname});
    });

    socket.on('text message', function(textMsg) {
        console.log("Received message: \"" +textMsg.message + "\" for room: " + textMsg.room);
        if(textMsg.room){
            io.sockets.in(textMsg.room).emit('text message', {from: socket.nick, message: textMsg.message, room: textMsg.room});
        }
    });

    socket.on('join', function (joinRequest) {
        console.log("Request to join room: " + joinRequest.room);
        socket.join(joinRequest.room);
        if (roomList.indexOf(joinRequest.room) === -1) {
            console.log("Creating room: " + joinRequest.room);
            roomList.push(joinRequest.room);
            io.emit('room create', joinRequest.room);
        }
    });
});

module.exports = chat;
