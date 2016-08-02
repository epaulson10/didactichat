/*
 * Copyright (c) Erik Paulson 2016
 */

var chat_log = {};

var timeout = 5000;

var timer = setInterval(storeMessages, chat_log.timeout);

var msgArr = [];

/*
 * Add an array of messages to the chat_log. A message is an object of the 
 * form { msg: <the message>, from: <who it is from>, room: <the room it origanted in>,
 * time: <the time it was sent>}
 */
chat_log.addMessage = function(message) {
    msgArr.push(message);
}

/*
 * Messages in the queue will be stored based on this timeout.
 * The default is every 5 seconds. The timeout is in milliseconds.
 */
chat_log.setSubmitTimeout = function(timeInMS) {
    timeout = timeInMS;
    clearInterval(timer);
    timer = setInterval(storeMessages, timeOut);
}

/*
 * Get the timeout in which messages get submitted
 */
chat_log.getSubmitTimeout = function() {
    return timeout;
}

/*
 * Returns the last numMsgs messages to have occurred for the given
 * room
 */
chat_log.getLastNMessages = function(numMsgs, room) {
    var rtnVal = msgArr.filter(function(msg) {
        return msg.room === room;
    });

    return rtnVal.slice(-numMsgs);
}

function storeMessages() {
    // This does nothing until we have a database
};

module.exports = chat_log;
