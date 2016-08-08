/*
 * Copyright (c) Erik Paulson 2016
 */

var express = require('express');
var router = express.Router();
var chatLog = require('../chat_log.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/chat');
});

router.get('/chat', function (req, res, next) {
    res.sendFile('public/chat.html', {root: __dirname + '/..'});
});

router.get('/chat/log', function (req, res) {
    var num = req.query.numMessages;
    var room = req.query.room;
    console.log("num messages: " + num);
    var messages = chatLog.getLastNMessages(num, room);
    console.log("GET messages: " + messages);
    res.json(messages);
});

router.post('/chat/log', function (req, res) {
    var msg = req.query.message;
    var from = req.query.from;
    var room = req.query.room;
    var time = req.query.time;

    var objToAdd = {msg: msg, from: from, room: room, time: time};
    console.log(objToAdd);
    chatLog.addMessage(objToAdd);
    res.sendStatus(200);
});

module.exports = router;
