var x= 1650;
var y= 1750;
const xmax = 2500;
const xmin = 800;
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
    constrain(y, ymin, ymax);
    vertical.servoWrite(y);
}
module.exports.servo_left = function() {
    x += stepsize;
    constrain(x, xmin, xmax);
    horizontal.servoWrite(x);
}
module.exports.servo_down = function() {
    y += stepsize;
    constrain(y, ymin, ymax);
    vertical.servoWrite(y);
}
module.exports.servo_right = function() {
    x -= stepsize;
    constrain(x, xmin, xmax);
    horizontal.servoWrite(x);
}
