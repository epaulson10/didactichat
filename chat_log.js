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
