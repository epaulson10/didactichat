var should = require('should');
var io = require('socket.io-client');
var serverURL = "http://localhost:3000";

describe('Basic tests', function() {
    it('Should connect clients to the server', function(done) {
        var client = io(serverURL, {multiplex: false});
        client.on('connect', function() {
            var client2 = io(serverURL, {multiplex: false});
            client2.on('connect', function() {
                done();
            });
        });
    });
});

describe('Chat Protocol Tests', function() {
    var client1;
    var client2;
    var msgString = 'Hello world!';
    // Set up some clients to send messages
    before(function(done) {
        client1 = io(serverURL, {multiplex: false});
        client1.on('connect', function() {
            client2 = io(serverURL, {multiplex: false});
            client2.on('connect', function() {
                done();
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
            done();
        });
        client1.emit('text message', {message: msgString});

    });
        
});
