/* Socket.io Library: http://socket.io/ */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('web'));
app.use(express.static('node_modules'));

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

    socket.on("serialOut", function(data) {
      io.emit("serialOut", data)
    })

    socket.on("serialIn", function(data) {
      switch(data.substring(0, data.indexOf(':')+1) {
        case "Status:":
          io.emit("Status", data.substring(data.indexOf(':' +1)))
          break
        case "M1 current:":
          io.emit("M1Current", data.substring(data.indexOf(':' +1)))
          break
        case "M2 current:":
          io.emit("M2Current", data.substring(data.indexOf(':' +1)))
          break
        case "Deg C:":
          io.emit("Temp", data.substring(data.indexOf(':' +1)))
          break
        case "M1:":
          io.emit("M1", data.substring(data.indexOf(':' +1)))
          break
        case "M2:":
          io.emit("M2", data.substring(data.indexOf(':' +1)))
          break
        default:
          io.emit("Log", data)
          break
      }
    })

    socket.on("disconnect", function(){
        console.log("User Disconnected");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
