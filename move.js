var SerialPortLib = require("serialport");
var SerialPort = SerialPortLib.SerialPort;
var serialPort = new SerialPort('/dev/cu.usbserial-AM01VDHP', {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: SerialPortLib.parsers.readline("\r\n")
});
var socket = require('socket.io-client')('http://localhost:3000');

serialPort.on("open", function () {
  console.log('Serial Port opened');
  socket.emit('serialIn', 'SerialPort: opened')

  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
    socket.emit('serialIn', data)
  });
});

serialPort.on('close', function() {
  socket.emit('serialIn', 'SerialPort: closed')
  console.log('Serial Port closed')
})

socket.on('connect', function(){
  console.log("Connected")
});
socket.on('serialOut', function(data) {
  write(data.valueL, data.valueR)
})
socket.on('disconnect', function(){
  console.log("Disconnected")
});

function write(valueL, valueR) {
    resultLeft = valueL*80;
    resultRight = valueR*80;
    if (valueL == 0)
        resultLeft = 0;
    if (valueR == 0)
        resultRight = 0;
    serialPort.write(resultLeft + ',' +resultRight+ '/n', function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
}
