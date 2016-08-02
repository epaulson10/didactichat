var should = require('should');
var chatLog = require('../chat_log.js');

var testMessage = {msg: "hello, world", from: "A user", room: "lobby", time: new Date().getTime()};

describe("API tests", function() {
    describe("addMessage", function() {
        it("should add a message without error", function() {
            chatLog.addMessage(testMessage);
        });
    });
    describe("getMessage", function() {
        this.timeout(chatLog.getSubmitTimeout()*2);
        before(function(done) {
            for (var i = 0; i < 100; i++) {
                chatLog.addMessage({msg: i.toString(), from: "doesn't matter", room: "lobby", 
                    time: new Date().getTime()});
            }
            // Delay to wait for the messages to be batched and stored
            setTimeout(function() {
                done();
            }, chatLog.getSubmitTimeout());
        });

        it("Should retrieve the correct messages in order", function() {
            var messages = chatLog.getLastNMessages(101, "lobby");
            messages[0].should.have.property('msg').which.is.equal(testMessage.msg);
            for (var i = 0; i < 100; i++) {
                var msg = messages[i+1];
                msg.should.have.property('msg').which.is.equal(i.toString());
            }

        });

        it("should return all available elements if you give it more than exist", function() {
            var messages = chatLog.getLastNMessages(150, "lobby");
            messages.should.have.length(101);
        });
    });
});
