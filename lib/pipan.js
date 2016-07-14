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

function servo_up() {
    y -= stepsize;
    constrain(y, ymin, ymax);
    fs.writeFile('/dev/servoblaster', yservo + "=" + y);
}
function servo_left() {
    x += stepsize;
    constrain(x, xmin, xmax);
    fs.writeFile('/dev/servoblaster', xservo + "=" + x);
}
function servo_down() {
    y += stepsize;
    constrain(y, ymin, ymax);
    fs.writeFile('/dev/servoblaster', yservo + "=" + y);
}
function servo_right() {
    x -= stepsize;
    constrain(x, xmin, xmax);
    fs.writeFile('/dev/servoblaster', xservo + "=" + x);
}
