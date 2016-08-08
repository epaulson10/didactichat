var socket = io();

var activeRoom = "Lobby";

var descriptionMap = {};
$(document).ready(function() {
    // On document ready, the activeRoom will be Lobby
    socket.emit('join', {room: activeRoom, desc: "The purgatory of chat-rooms"});

    var nickName = Cookies.get("didactichatNickname");
    if (nickName === undefined || nickName === null || nickName === "") {
        nickName = "";
        while (nickName === null) {
            nickName = window.prompt("Enter your nickname (can't be blank)");
        }
        Cookies.set("didactichatNickname", nickName, {expires: 7});
    }

    socket.emit("NICK", nickName);
    updateTitle();
});

function sendMessage() {
    var msgBox = $("#composeBox");
    socket.emit('text message', { message: msgBox.val(), room: activeRoom});
    msgBox.val("");
};

function sendNick() {
    var nickBox = $('#nickBox');
    Cookies.set("didactichatNickname", nickBox.val(), {expires: 7});
    socket.emit('NICK', nickBox.val());
    nickBox.val('');
};

function createRoom() {
    var room;
    room = window.prompt("Enter room name");
    if (room !== null && room !== "") {
        if(!checkStr(room)) return;
        var desc = window.prompt("Enter a description of this room (not required)");
        socket.emit('join', {room: room, desc: desc});
    }
}

function checkStr(str) {
    if(/^[a-zA-Z0-9-_]+$/.test(str) == false) {
        alert("Only alphanumeric characters and -, _ allowed");
        return false;
    };
    return true;
}

function addRoomClickHandler(room) {
    $('#'+room + "list").click(function() {
        if ($(this).text() === activeRoom) return;

        $(this).css('color', 'blue');
        $('#'+activeRoom + "list").css('color', 'black');
        $('#'+activeRoom).hide();
        activeRoom = $(this).text();
        $('#'+activeRoom).show();
        updateTitle();
    });
}

socket.on('text message', function(message) {
    var messageList = $('#messageList');
    addTextToMsgWindow(message.from + ": " + message.message, message.room);
});

socket.on('NICK', function(nickChange) {
    if (nickChange.oldNick !== null) {
        var changeStr = nickChange.oldNick + " is now known as " + nickChange.newNick + ".";
        addTextToMsgWindow(changeStr);
    }
});

socket.on('room create', function(newRoomObj) {
    var roomName = newRoomObj.room;
    var desc = newRoomObj.desc;
    $('#roomList').append("<li class='clickable' id=" + roomName+ "list><a>" + roomName + "</a></li>");
    $('#messageDiv').append("<ul id="+ roomName + "></ul>");
    if ($('#messageDiv').children().length > 1) {
        $('#'+roomName).hide();
    } else {
        $('#'+roomName + "list").css('color', 'blue');
    }
    descriptionMap[roomName] = desc;
    updateTitle();
    socket.emit('join', {room: roomName});
    addRoomClickHandler(roomName);
});


socket.on('room list', function(roomList) {
    for (var i = 0; i < roomList.length; i++) {
        var roomName= roomList[i].room;
        var desc = roomList[i].desc;
        descriptionMap[roomName] = desc;

        $('#roomList').append("<li class='clickable' id=" + roomName+"list>" + roomName + "</li>");
        $('#messageDiv').append("<ul id="+ roomName + "></ul>");
        addRoomClickHandler(roomName);
        socket.emit('join', {room: roomName, desc: desc});
        if (i == 0) {
            $('#' + roomName + 'list').css('color','blue');
        } else {
            $('#' + roomName).hide();
        }
        updateTitle();
        getMessagesForRoom(roomName, 20);
    }
});


function updateTitle() {
    var textToDisplay = activeRoom;
    if (descriptionMap[activeRoom] !== null && descriptionMap[activeRoom] !== "") {
        textToDisplay = textToDisplay+": <em>"+descriptionMap[activeRoom]+"</em>";
    }
    $('#roomNameHeader').html(textToDisplay);
}

function getMessagesForRoom(room, numMessages) {
    $.get("/chat/log", {numMessages: numMessages, room: room}, 
        function(messageArr) {
            for (var i = 0; i < messageArr.length; i++) {
                addTextToMsgWindow(messageArr[i].from + ": " + messageArr[i].message, room, true);
            }
        });
};

function addTextToMsgWindow(text, room, isChatHistory = false) {
    var msgList;
    var roomListElem;
    if (room === undefined) {
        room = activeRoom;
        msgList = $('#' + activeRoom);
        roomListElem = $('#' + activeRoom + 'list');

    } else {
        msgList = $('#' + room);
        roomListElem = $('#' + room + 'list');
    }
    
    if (!isChatHistory && room != activeRoom) {
        roomListElem.css('color', 'red');
    }
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
