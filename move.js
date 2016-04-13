var SerialPortLib = require("serialport");
var SerialPort = SerialPortLib.SerialPort;
//list of serialPorts to check for validity, listed by priority
//mac testing(only when plugged in), usb serial(only when plugged in), gpio serial(always present)
var serialPorts = ["/dev/cu.usbserial-AM01VDHP", "/dev/ttyUSB0", "/dev/ttyAMA0"];
SerialPortLib.list(function(err, ports) {
  var found = false
  for (j = 0; j < serialPorts.length; j ++) {
    item = serialPorts[j];
    console.log(item)
    for ( i = 0; i < ports.length; i ++){
      var port = ports[i];
      console.log(port.comName);
      if (port.comName === item) {
        var serialPort = new SerialPort(item, {
          baudRate: 9600,
          dataBits: 8,
          parity: 'none',
          stopBits: 1,
          flowControl: false,
          parser: SerialPortLib.parsers.readline("\r\n")
        },function(error) {
          //if port does not exist, error will be thrown.
            if (error !== undefined) {
              console.log("err " + error);
              process.exit(1);
            }
            else {
              console.log('Opened successfully')
              onReady(serialPort)
            }
        });
        break;
      }
    }
    if (found) {
      break;
    }
  };
});
var socket = require('socket.io-client')('http://localhost:3000');

//call when serial port is opened
function onReady(serialPort) {
  //stop program if Serial Port still has no port opened
  if (serialPort === undefined) {
    console.log("No serialPort opened")
    process.exit(1);
  }
  else if (serialPort.isOpen()) {
    console.log("serialPort opened")
    socket.emit('serialIn', 'SerialPort: opened')
  }
  serialPort.on("open", function () {
    //log Serial Port status
    console.log('Serial Port opened');
    socket.emit('serialIn', 'SerialPort: opened')
  });

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
}


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
