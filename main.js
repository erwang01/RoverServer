/* Socket.io Library: http://socket.io/ */

var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/web/index.html");
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
