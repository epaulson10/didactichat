var socket = io();

function sendMessage() {
    var msgBox = $("#composeBox");
    socket.emit('text message', { message: msgBox.val()});
};

function sendNick() {
    var nickBox = $('#nickBox');
    socket.emit('NICK', nickBox.val());
    nickBox.val('');
};

socket.on('text message', function(message) {
    var messageWindow = $('#messageWindow');
    messageWindow.val(messageWindow.val() + '\n' + message.from + ": " + message.message);

});

socket.on('NICK', function(nickChange) {
    var messageWindow = $('#messageWindow');
    var changeStr = nickChange.oldNick + " is now known as " + nickChange.newNick + ".";
    messageWindow.val(messageWindow.val() + '\n' + changeStr);
});

