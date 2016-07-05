/* Socket.io Library: http://socket.io/ */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Log = require("./lib/log.js")(true);
var Arduino = require("./lib/arduino.js");
var users = 0;

app.use(express.static('web'));
app.use("/node_modules", express.static('node_modules'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/web/index.html");
});

Arduino.on("status", function(status) {
    Log.i("Status: " + status);
    io.emit("status", status);
});

Arduino.on("M1 current", function(current) {
    Log.i("M1 current: " + current);
    io.emit("M1 current", current);
});

Arduino.on("M2 current", function(current) {
    Log.i("M2 current: " + current);
    io.emit("M2 current", current);
});

//used to be called M1, check for compatibility errors
Arduino.on("M1Speed", function(speed) {
    Log.i("M1Speed: " + speed);
    io.emit("M1Speed", speed);
});

Arduino.on("M2Speed", function(speed) {
    Log.i("M2Speed: " + speed);
    io.emit("M2Speed", speed);
});

Arduino.on("temp", function(temp) {
    Log.i("Temperature: " + temp);
    io.emit("temp", temp);
});

Arduino.on("SerialPort", function(status) {
    Log.i("SerialPort: " + status);
    io.emit("SerialPort", status);
});

Arduino.on("VBatt", function(voltage) {
    Log.i("VBatt: " + voltage);
    io.emit("VBatt", voltage);
});

Arduino.on("CBatt", function(capacity) {
    Log.i("CBatt: " + capacity);
    io.emit("CBatt", capacity);
});

Arduino.on("IBatt", function(current) {
    Log.i("IBatt: " + current);
    io.emit("IBatt", current);
});

Arduino.on("log", function(data) {
    Log.i("log: " + data);
    io.emit("log", data);
});

io.on("connection", function(socket){
    Log.d("User Connected");
    users++;

    //changes camera rotation
    socket.on("pipan", function(data) {
        io.emit("pipan", data)
    });

    socket.on("serialOut", function(data) {
        io.emit("serialOut", data)
        Arduino.emit("serialOut", data)
    });

    socket.on("gamepad", function(data) {
      io.emit("gamepad", data);
    });

    /* watchdog socket not needed as gamepad writes every 20 ms
    socket.on("watchdog", function(data) {
      io.emit("watchdog", data);
    })
    */

    socket.on("disconnect", function(){
        Log.d("User Disconnected");
        users --;
        if (users <2) {
            io.emit("serialOut", {valueL:0, valueR:0})
            Arduino.emit("serialOut", {valueL:0, valueR:0})
        }
    });
});

http.listen(3000, function(){
    Log.i('listening on *:3000');
});
