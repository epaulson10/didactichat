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
            should(data).have.property('oldNick').which.is.equal('Anonymous');
            should(data).have.property('newNick').which.is.equal('Steve');
            done();
        });

        client1.emit('NICK', 'Steve');
    });

});
