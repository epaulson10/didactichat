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

var should = require('should');
var io = require('socket.io-client');
var serverURL = "http://localhost:3000";

var app;

before(function() {
    app = require('../bin/wwwModule.js');
    app.startServer();
});
after (function() {
    app.server.close();
});

describe('Basic tests', function() {
    it('Should connect clients to the server', function(done) {
        var client = io(serverURL, {multiplex: false});
        client.on('connect', function() {
            var client2 = io(serverURL, {multiplex: false});
            client2.on('connect', function() {
                client.disconnect();
                client2.disconnect();
                done();
            });
        });
    });
});

describe('Chat Protocol Tests', function() {
    var client1;
    var client2;
    var joinRequest = {room: "test"};
    var msgString = 'Hello world!';
    // Set up some clients to send messages
    before(function(done) {
        client1 = io(serverURL, {multiplex: false});
        client1.on('connect', function() {
            client1.emit('join', joinRequest);
            client2 = io(serverURL, {multiplex: false});
            client2.on('connect', function() {
                client2.emit('join', joinRequest);
                // This delay is needed, otherwise the server won't receive the join in time
                setTimeout(done, 300);
            });
        });
    });

    after(function() {
        client1.disconnect();
        client2.disconnect();
    });

    it('should broadcast text messages from one user to another', function(done) {
        client2.on('text message', function(data) {
            should(data).have.property('message').which.is.equal('Hello world!');
            should(data).have.property('room').which.is.equal(joinRequest.room);
            done();
        });
        client1.emit('text message', {message: msgString, room: joinRequest.room});

    });

    it('should broadcast NICK updates in the chat', function(done) {
        client2.on('NICK', function(data) {
            should(data).have.property('oldNick').which.is.null;
            should(data).have.property('newNick').which.is.equal('Steve');
            done();
        });

        client1.emit('NICK', 'Steve');
    });

});
