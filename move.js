var SerialPortLib = require("serialport");
var SerialPort = SerialPortLib.SerialPort;
var serialPort = new SerialPort('/dev/cu.usbserial-AM01VDHP', {  //For MAC
//var serialPort = new SerialPort('/dev/ttyAMA0', {       //For Raspberry Pi
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: SerialPortLib.parsers.readline("\r\n"),
  function(error) {
    console.log("err " + error);
  }
});
var socket = require('socket.io-client')('http://localhost:3000');

serialPort.on("open", function () {
  //log Serial Port status and open ports
  console.log('Serial Port opened');
  serialPort.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });
  socket.emit('serialIn', 'SerialPort: opened')

  //reads lines of Serial input data
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
    socket.emit('serialIn', data)
  });

  //log serial port closing
  serialPort.on('close', function(error) {
    socket.emit('serialIn', 'SerialPort: closed')
    console.log('Serial Port closed')
    if (error !== undefined) {
      console.log('error '+ error)
    }
  });

  //log serial port disconnect
  serialPort.on('disconnect', function(error) {
    socket.emit('serialIn', 'SerialPort: Disconnected')
    console.log('Serial Port Disconnected')
    if (error !== undefined) {
      console.log('error '+ error)
    }
  })
});

//log socket connect
socket.on('connect', function(){
  console.log("Connected")
});

//write to serial
socket.on('serialOut', function(data) {
  if(serialPort.isOpen()) {
    write(data.valueL, data.valueR)
  }
  else {
    socket.emit('serialIn', 'Error: Unable to send command, Serial Port closed')
  }
  console.log(data)
});
socket.on('disconnect', function(){
  console.log("Disconnected")
  write(0,0);
  serialPort.close();
});

//write function takes in left and right values to be written to serial.
//currently accepts speeds between -5 and 5.
function write(valueL, valueR) {
    resultLeft = valueL*80;
    resultRight = valueR*80;
    if (valueL == 0)
        resultLeft = 0;
    if (valueR == 0)
        resultRight = 0;

    //limit values down to -400 to 400
    if (resultLeft>400) {
      resultLeft = 400;
    }
    else if (resultLeft<-400) {
      resultLeft = -400;
    }
    if (resultRight>400) {
      resultRight = 400;
    }
    else if (resultRight<-400) {
      resultRight = -400;
    }
    
    serialPort.write(resultLeft + ',' +resultRight+ '/n', function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
}
