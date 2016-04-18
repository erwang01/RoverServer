var gamepads = {};
var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var socket = require('socket.io-client')('http://196.168.15.149:3000');
var command;
var scan;
//handles connection and disconnection of gamepads
function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connecting) {
    gamepads[gamepad.index] = gamepad;
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);
    socket.emit("gamepad", connected)
    setInterval(commandLoop, 20);
  } else {
    delete gamepads[gamepad.index];
    console.log("Gamepad disconnected from index %d: %s",
      e.gamepad.index, e.gamepad.id);
    socket.emit("gamepad",disconnected)
  }
}

//function keeps getting values from first gamepad checking axis 0 and 1 for x y values respectively.
//maps values to left right motors and again maps that to axis 2, throttle.
function commandLoop () {
  var gamepadconnected = false;
    for (gamepad in gamepads) {
      if (gamepadconnected) {
      }
      else if (gamepad) {
        if (gamepad.connected) {
          gamepadconnected = true;
          var axis = gamepad.axes;
          var data = {valueL: 0, valueR: 0}
          //when switched to mode Orange with button 24, tank drive active
          // axis 2 (throttle) is left and joystick is right.
          if (gamepad.button[24]) {
            var right = -axis[1];
            var left = axis[2];
            data.valueL = left;
            data.valueR = right;
          } else {
            var drivePower = -axis[1];
            var turnPower = axis[0];
            var throttle = axis[2];
            data.valueL = (drivePower + turnPower)/2*throttle;
            data.valueR = (drivePower - turnPower)/2*throttle;
          }
          socket.emit("serialOut", data);
        }
      }
    }
  if(!gamepadconnected) {
    clearInterval(command)
  }
}

//scans for gamepads in chrome based browsers
function scangamepads() {
  var gamepad = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepad.length; i++) {
    if (gamepad[i]) {
      if (!(gamepad[i].index in gamepads)) {
        gamepadHandler(gamepad[i], true);
      } else {
        gamepads[gamepad[i].index] = gamepad[i];
      }
      clearInterval(scan);      //stop polling for new gamepads once one is found. this may be problamatic right now considering above code structure is for multiple pads.
    }
  }
}

//determine which event listener is best
if (haveEvents) {
  window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
  window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", function(e) { gamepadHandler(e, true); }, false);
  window.addEventListener("webkitgamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
} else {
  scan = setInterval(scangamepads, 500);
}
