var http = require('http');
var chat = {};
var io = require('socket.io')();
chat.io = io;

io.on('connection', function(socket) {
    console.log("Someone connected");
    socket.nick = "Anonymous";

    socket.on('NICK', function(nickname) {
        var old = socket.nick;
        socket.nick = nickname;
        io.emit('NICK', {oldNick: old, newNick: nickname});
    });

    socket.on('text message', function(textMsg) {
        console.log("Received message:" +textMsg.message);
        io.emit('text message', {from: socket.nick, message: textMsg.message});
    });
});

module.exports = chat;
