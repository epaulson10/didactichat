var socket = io();

function sendMessage() {
    var msgBox = $("#composeBox");
    socket.emit('text message', { message: msgBox.val()});
};

socket.on('text message', function(message) {
    var messageWindow = $('#messageWindow');
    messageWindow.val(messageWindow.val() + '\n' + message.message);
});

