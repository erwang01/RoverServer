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

serialPort.on("open", function () {
  console.log('Serial Port opened');

  serialPort.on('data', function(data) {
    console.log('data received: ' + data);

  });
/*
  serialPort.write(new Buffer('4','ascii'), function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
  */
});
