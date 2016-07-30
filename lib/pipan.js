var x= 165;
var y= 175;
const xmax = 250;
const xmin = 80;
const ymax = 245;
const ymin = 100;
const stepsize = 5;
const fs = require('fs');
const xservo = "5";
const yservo = "6";

module.exports = {};
module.exports.servo_up = function() {
    y -= stepsize;
    constrain(y, ymin, ymax);
    fs.writeFile('/dev/servoblaster', yservo + "=" + y);
}
module.exports.servo_left = function() {
    x += stepsize;
    constrain(x, xmin, xmax);
    fs.writeFile('/dev/servoblaster', xservo + "=" + x);
}
module.exports.servo_down = function() {
    y += stepsize;
    constrain(y, ymin, ymax);
    fs.writeFile('/dev/servoblaster', yservo + "=" + y);
}
module.expotrs.servo_right = function() {
    x -= stepsize;
    constrain(x, xmin, xmax);
    fs.writeFile('/dev/servoblaster', xservo + "=" + x);
}
