const express = require('express');
const moment = require('moment');
const server = require('http').Server(express);
const io = require('socket.io')(server);
io.on('connection', function(socket) {
    const socketid = socket.id;
    console.log('a user connected with session id '+ socketid);
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('message', function(jsonMsg) {
        jsonMsg.time = moment().format('LLLL');
        console.log('received message from client: '+JSON.stringify(jsonMsg));
        io.sockets.emit('message', jsonMsg);
    });
   }
);
server.listen(3001, function() {
    console.log('Server started (3001)');
});
