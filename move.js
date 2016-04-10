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

});

function write(valueL, valueR) {
    resultLeft = valueL*80;
    resultRight = valueR*80;
    if valueL == 0:
        resultLeft = 0;
    if valueR == 0:
        resultRight = 0;
    if serialPort.write(new Buffer(resultLeft + ',' +resultRight+ '/n','utf8'), function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
}
