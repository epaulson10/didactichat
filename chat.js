var http = require('http');
var chat = {};
var Server = require('socket.io');
var io = Server();
chat.io = io;

io.on('connection', function() {
    console.log("Someone connected");
});

module.exports = chat;
