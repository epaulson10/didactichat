/*
 * Copyright (c) Erik Paulson 2016
 *
 * This file is part of didactichat.
 *
 * didactichat is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * didactichat is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with didactichat.  If not, see <http://www.gnu.org/licenses/>.
 */
var http = require('http');
var chat = {};
var io = require('socket.io')();
var chatLog = require('./chat_log.js');
chat.io = io;

var roomList = [];

io.on('connection', function(socket) {
    console.log("Someone connected");
    socket.nick = null;
    socket.room = "chat";
    socket.emit('room list', roomList);

    socket.on('NICK', function(nickname) {
        // Don't let someone change their nickname to garbage
        if (nickname == undefined || nickname === ""
            || nickname === null) {
                return;
        }
        var old = socket.nick;
        socket.nick = nickname;
        io.emit('NICK', {oldNick: old, newNick: nickname});
    });

    socket.on('text message', function(textMsg) {
        console.log("Received message: \"" +textMsg.message + "\" for room: " + textMsg.room);
        var msgObj = {from: socket.nick, message: textMsg.message, room: textMsg.room};
        if(textMsg.room){
            io.sockets.in(textMsg.room).emit('text message', msgObj);
        }

        // TODO: Decide if I care about time stamps
        msgObj.time = new Date().getTime();
        chatLog.addMessage(msgObj);
    });

    socket.on('join', function (joinRequest) {
        if (!joinRequest || joinRequest.room == undefined || joinRequest.room === ""
            || joinRequest.room === null) {
                return;
            }

        console.log("Request to join room: " + joinRequest.room);
        socket.join(joinRequest.room);
        if (!roomList.some(function(room) {
            if (room.room === joinRequest.room) return true;
            return false;
        })) {
            console.log("Creating room: " + joinRequest.room);
            var roomObj = {room: joinRequest.room, desc: joinRequest.desc};
            roomList.push(roomObj);
            io.emit('room create', roomObj);
        }
    });
});

module.exports = chat;
