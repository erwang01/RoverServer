//Communication between Arduino and Server. Acts as a bridge between the socket communication and arduino

var SerialPort = require("serialport");
//list of serialPorts to check for validity, listed by priority
//mac testing(only when plugged in), usb serial(only when plugged in), gpio serial(always present)
var serialPorts = ["/dev/cu.usbserial-AM01VDHP", "/dev/ttyUSB0", "/dev/ttyAMA0"];
//var serialPorts = ["/dev/ttyAMA0"]
var serialPort;
var time = Date.now();
var Log = require("./log.js")(true);
var callbacks = {};
var listeners = {};

function startConnection() {
    SerialPort.list(function(err, ports) {
        var found = false;
        //scroll through each port to check if present
        LoopPreset:
        for (var j = 0; j < serialPorts.length; j++) {
            var item = serialPorts[j];
            Log.i("Opening connection with " + item);
            //Cycle through ports on server
            LoopOnBoardPorts:
            for ( var i = 0; i < ports.length; i ++){
                var port = ports[i];
                if (port.comName === item) {
                    Log.i("Serial Port " + port.comName + "is a match")
                    serialPort = new SerialPort(item, {
                        baudRate: 9600,
                        dataBits: 8,
                        parity: 'none',
                        stopBits: 1,
                        flowControl: false,
                        parser: SerialPort.parsers.readline("\r\n")
                    },function(error) {
                        //if port does not exist, error will be thrown. (this should never happen)
                        if (error !== null) {
                            Log.e("SerialPort Opening: " + error);
                            throw new Error("No serialport found");
                        }
                        else {
                            Log.i('Opened successfully')
                            updateTime()
                            checkTime()
                            onReady()
                        }
                    });
                    found = true;
                    break LoopPreset;
                }
                else {
                    Log.i("Serial Port " + port.comName + "does not match");
                }
            }
        };
        if (!found) {
            Log.e("No serialPort found")
        }
    });
}

//call when serial port is opened
function onReady() {
    //stop program if Serial Port still has no port opened
    if (serialPort === undefined || serialPort === null) {
        Log.e("No serialPort opened")
        process.exit(1);
    }
    else if (serialPort.isOpen()) {
        Log.i("serialPort opened")
        call("serialPort", "opened");
    }
    serialPort.on("open", function () {
        //log Serial Port status
        Log.i("serialPort opened")
        call("serialPort", "opened");
    });

    //reads lines of Serial input data
    serialPort.on('data', function(data) {
        call("serialPort", "opened")
        updateTime()
        if (data.indexOf(':') !== -1){
            switch(data.substring(0, data.indexOf(':')+1)) {
                case "Status:":
                    call("status", data.substring(data.indexOf(':')+1))
                    break
                case "M1 current:":
                    call("M1Current", data.substring(data.indexOf(':')+1))
                    break
                case "M2 current:":
                    call("M2Current", data.substring(data.indexOf(':')+1))
                    break
                case "Deg C:":
                    call("temp", data.substring(data.indexOf(':')+1))
                    break
                case "M1:":
                    call("M1Speed", data.substring(data.indexOf(':')+1))
                    break
                case "M2:":
                    call("M2Speed", data.substring(data.indexOf(':')+1))
                    break
                case "SerialPort:":
                    call("serialPort", data.substring(data.indexOf(':')+1))
                    break;
                case "VBatt:":
                    call("VBatt", data.substring(data.indexOf(':') + 1))
                    break;
                case "CBatt:":
                    call("CBatt", data.substring(data.indexOf(':') + 1))
                    break;
                case "IBatt:":
                    call("IBatt", data.substring(data.indexOf(':') + 1))
                    break;
                default:
                    call("log", data)
                    break
            }
        } else {
            call("log", data)
        }
    });

    serialPort.on('error', function (err) {
        Log.e('SerialPort Error: ' + err.message);
    })

    //log serial port closing
    serialPort.on('close', function(error) {
        call("serialPort", "closed")
        Log.i('Serial Port closed')
        if (error !== null) {
            Log.e('SerialPort Close: '+ error)
        }
    });

    //log serial port disconnect
    serialPort.on('disconnect', function(error) {
        call("serialPort", "disconnected")
        Log.i('Serial Port disconnected')
        if (error !== null) {
            Log.e('SerialPort Disconnect: '+ error)
        }
    })
}

//attempt to connect with serial
startConnection();

//write to serial
listen('serialOut', function(data) {
    if(serialPort.isOpen()) {
        write(data.valueL, data.valueR)
    }
    else {
        Log.e('Error: Unable to send command, Serial Port closed')
    }
});
/*
//watchdog socket, not currently needed as gamepad should write every 20 ms
socket.on('watchdog', function(data) {
console.log(data);
serialPort.write(' ');
})
*/
//disconnected socket
listen('disconnect', function(){
    Log.i("Disconnected")
    if(serialPort.isOpen()) {
        write(0 , 0)
    }
    serialPort.close();
});

//reconnect to serial
listen('reconnect', function(data) {
    if(data) {

    }
})

//write function takes in left and right values to be written to serial.
//currently accepts speeds between -5 and 5.
function write(valueL, valueR) {
    resultLeft = Math.round(valueL*400);
    resultRight = Math.round(valueR*400);
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

    Log.i("L: " + resultLeft + ", R: " + resultRight)

    serialPort.write(resultLeft + ',' +resultRight+ '\r\n', function(err) {
      	if (err !== null) {
            Log.e("Write Error: " + err)
        }
        serialPort.drain();
    });
}

//called when comms from arduino recieved
function updateTime() {
    time = Date.now();
}

//check for connection
//this function will always run, acting as a watch dog, stops rover every time connection is lost.
//also posts this as a serialPort disconnect on the web page
function checkTime() {
    var currentTime = new Date().getTime()
    if (time < currentTime-2000) {
        call('serialPort', 'Disconnected')
        Log.e("timeout")
        write(0,0);
        updateTime();
    }
    setTimeout(checkTime,2000+time-currentTime);
}

function call(name) {
    var args = arguments;
    if (callbacks.hasOwnProperty(name) && isArray(callbacks[name])) {
        callbacks[name].map(function(callback) {
            callback.apply(callback, Array.prototype.slice.call(args, 1));
        });
    }
}

function listen(name, listener) {
    if (listeners.hasOwnProperty(name)) {
        listeners[name].push(listener);
    } else {
        listeners[name] = [listener];
    }
}

function isArray(arrayToTest) {
    return Object.prototype.toString.call(arrayToTest) === '[object Array]'
}

module.exports = {};
module.exports.on = function(name, callback) {
    if (callbacks.hasOwnProperty(name) && isArray(callbacks[name])) {
        callbacks[name].push(callback);
    } else {
        callbacks[name] = [callback];
    }
}
module.exports.emit = function(name) {
    var args = arguments;
    if (listeners.hasOwnProperty(name)) {
        listeners[name].map(function(listener) {
            listener.apply(listener, Array.prototype.slice.call(args, 1));
        })
    }
}
