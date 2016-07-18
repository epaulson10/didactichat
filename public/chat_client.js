var socket = io();

function sendMessage() {
    var msgBox = $("#composeBox");
    socket.emit('text message', { message: msgBox.val()});
    msgBox.val("");
};

function sendNick() {
    var nickBox = $('#nickBox');
    socket.emit('NICK', nickBox.val());
    nickBox.val('');
};

socket.on('text message', function(message) {
    var messageList = $('#messageList');
    addTextToMsgWindow(message.from + ": " + message.message);
});

socket.on('NICK', function(nickChange) {
    var changeStr = nickChange.oldNick + " is now known as " + nickChange.newNick + ".";
    addTextToMsgWindow(changeStr);
});

function addTextToMsgWindow(text) {
    var msgList = $('#messageList');
    var msgDiv = $('#messageDiv');
    msgList.append("<li>" + text + "</li>");
    msgDiv.scrollTop(msgDiv.prop('scrollHeight'));
}

$(document).on("keydown", "#composeBox", function(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
});

$(document).on("keydown", "#nickBox", function(event) {
    if (event.keyCode == 13) {
        sendNick();
    }
});
