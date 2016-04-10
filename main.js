/* Socket.io Library: http://socket.io/ */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('web'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/web/index.html");
});

io.on("connection", function(socket){
    console.log("User Connected");

    socket.on("channelName", function(data) {
        console.log("User sent data from channel channelName with data " + data);
        console.log("Sending data to everyone...");

        io.emit("someData", "Data received: " + data); // note: Use socket.broadcast.emit to send to everyone but sender.
    });

    socket.on("disconnect", function(){
        console.log("User Disconnected");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
