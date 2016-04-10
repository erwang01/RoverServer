/* Socket.io Library: http://socket.io/ */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('web'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/web/index.html");
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
