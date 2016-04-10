var socket = io();

socket.on("connect", function() {
    console.log("Connected!");
});
socket.on("disconnect", function() {
    console.log("Disconnected!");
});

socket.on("someData", function(data) {
    console.log("Data received: " + data);
});

setTimeout(function() {
    socket.emit("channelName", "Some data from client that should come back to this client.");
}, 1000);
