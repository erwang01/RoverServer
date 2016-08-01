var x= 1650;
var y= 1750;
const xmax = 2500;
const xmin = 700;
const ymax = 2450;
const ymin = 1000;
const stepsize = 50;
const xservo = 17;
const yservo = 18;

var Gpio = require('pigpio').Gpio,
  horizontal = new Gpio(xservo, {mode: Gpio.OUTPUT}),
  vertical = new Gpio(yservo, {mode: Gpio.OUTPUT});

module.exports = {};
module.exports.servo_up = function() {
    y -= stepsize;
    y = constrain(y, ymin, ymax);
    vertical.servoWrite(y);
    return y;
}
module.exports.servo_left = function() {
    x += stepsize;
    x = constrain(x, xmin, xmax);
    horizontal.servoWrite(x);
    return x;
}
module.exports.servo_down = function() {
    y += stepsize;
    y = constrain(y, ymin, ymax);
    vertical.servoWrite(y);
    return y;
}
module.exports.servo_right = function() {
    x -= stepsize;
    x = constrain(x, xmin, xmax);
    horizontal.servoWrite(x);
    return x;
}

function constrain(number, min, max) {
    return Math.min(Math.max(number, min), max)
}
