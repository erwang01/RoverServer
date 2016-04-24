var gamepads = {};
var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var socket = io();
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
      gamepad.index, gamepad.id,
      gamepad.buttons.length, gamepad.axes.length);
    console.log(gamepads[gamepad.index])
    socket.emit("gamepad", "connected")
    commandLoop();
  } else {
    delete gamepads[gamepad.index];
    console.log("Gamepad disconnected from index %d: %s",
      gamepad.index, gamepad.id);
    socket.emit("gamepad","disconnected")
  }
}

//function keeps getting values from first gamepad checking axis 0 and 1 for x y values respectively.
//maps values to left right motors and again maps that to axis 2, throttle.
function commandLoop () {
  scangamepads();
  var gamepadconnected = false;
  var j;
  for (j in gamepads) {
    var gamepad = gamepads[j];
    if (gamepadconnected) {
    }
    else if (gamepad) {
      if (gamepad.connected) {
        gamepadconnected = true;
        var axis = gamepad.axes;
        var data = {valueL: 0, valueR: 0}
        //when switched to mode Orange with button 24, tank drive active
        // axis 2 (throttle) is left and joystick is right.
        if(gamepad.buttons[25].pressed){
          data.valueL=0;
          data.valueR=0;
        }
        else if (gamepad.buttons[24].pressed) {
          var right = -axis[1];
          var left = -axis[2];
          data.valueL = left;
          data.valueR = right;
        } else {
          var drivePower = deadspace(-axis[1]);
          var turnPower = deadspace(axis[0]);
          var throttle = (-axis[2]+1)/2;
          console.log("throttle = " + throttle)
          console.log("turnPower = " + turnPower)
          console.log("drivePower = " + drivePower)
          data.valueL = (drivePower + turnPower)*throttle;
          data.valueR = (drivePower - turnPower)*throttle;
          data = limit(data)
        }
        //data should be values between -1 and 1
        socket.emit("serialOut", data);
        console.log(data)

        var pan;
        pan.x = gamepad.buttons[20].value-gamepad.buttons[22].value
        pan.y = gamepad.buttons[19].value-gamepad.buttons[21].value
        socket.emit("pipan",pan)
        if(pan.x === 1) {
            //camera right
            servo_right()
        }
        else if(pan.x === -1) {
            //camera left
            servo_left()
        }
        if(pan.y === 1) {
            //camera up
            servo_up()
        }
        else if(pan.y === -1) {
            //camera down
            servo_down()
        }
      }
    }
  }
  if (gamepadconnected) {
    setTimeout(commandLoop,100)
  }
}

//removes deadspace by translating such space to be 0.
function deadspace(value) {
  if(Math.abs(value)<0.03) {
    value = 0;
  }
  return value;
}

//limits power to -1 and 1
function limit( data ) {
  if (Math.abs(data.valueL)>1) {
    data.valueR = data.valueR/Math.abs(data.valueL);
    data.valueL = data.valueL/Math.abs(data.valueL);
  }

  if (Math.abs(data.valueR)>1) {
    data.valueL = data.valueL/Math.abs(data.valueR);
    data.valueR = data.valueR/Math.abs(data.valueR);
  }

  if(Math.abs(data.valueL) = 0 && Math.abs(data.valueR) != 0) {
    data.valueL = 0.1;
  }

  if(Math.abs(data.valueR) = 0 && Math.abs(data.valueL) != 0) {
    data.valueR = 0.1;
  }
  return data;
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
    }
  }
  clearInterval(scan);
}

if (JSON.stringify(gamepads) !== JSON.stringify({})) {
  console.log(gamepads)
  commandLoop();
}
//determine which event listener is best
if (haveEvents) {
  window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
  window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
  console.log("haveEvents: "+ haveEvents)
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", function(e) { gamepadHandler(e, true); }, false);
  window.addEventListener("webkitgamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
  console.log("haveWebkitEvents: "+ haveWebkitEvents)
} else {
  scan = setInterval(scangamepads, 500);
  console.log("scanning for gamepad")
}
