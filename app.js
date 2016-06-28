/* Socket.io Library: http://socket.io/ */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Log = require("./lib/log.js")(true);

app.use(express.static('web'));
app.use(express.static('node_modules'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/web/index.html");
});

io.on("connection", function(socket){
    Log.d("User Connected");

    socket.on("serialOut", function(data) {
        io.emit("serialOut", data)
    });

    socket.on("serialIn", function(data) {
        if (data.indexOf(':') !== -1){
            switch(data.substring(0, data.indexOf(':')+1)) {
                case "Status:":
                    io.emit("status", data.substring(data.indexOf(':')+1))
                    break
                case "M1 current:":
                    io.emit("M1Current", data.substring(data.indexOf(':')+1))
                    break
                case "M2 current:":
                    io.emit("M2Current", data.substring(data.indexOf(':')+1))
                    break
                case "Deg C:":
                    io.emit("temp", data.substring(data.indexOf(':')+1))
                    break
                case "M1:":
                    io.emit("M1", data.substring(data.indexOf(':')+1))
                    break
                case "M2:":
                    io.emit("M2", data.substring(data.indexOf(':')+1))
                    break
                case "SerialPort:":
                    io.emit("serialPort", data.substring(data.indexOf(':')+1))
                default:
                    io.emit("log", data)
                    break
            }
        } else {
            io.emit("log", data)
        }
        console.log(data)
    })

    socket.on("disconnect", function(){
        Log.d("User Disconnected");
    });
});

http.listen(3000, function(){
    Log.i('listening on *:3000');
});
