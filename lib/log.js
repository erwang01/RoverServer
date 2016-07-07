var colors = require("colors");
const fs = require('fs');

function Logger(debug) {
    this.debug = debug;
}
Logger.prototype.d = function(msg) {
    if (this.debug) {
        msg = `DEBUG [${new Date().toString()}]: ${msg}`;
        console.log(msg.cyan);
        fs.appendFile('log.txt', msg + "\n", function (err) {
            if (err) throw err;
        });
    }
};
Logger.prototype.i = function(msg) {
    console.info(msg);
    fs.appendFile('log.txt', new Date().toString() + msg + "\n", function (err) {
        if (err) throw err;
    });
};
Logger.prototype.e = function(msg) {
    msg = `=============== ERROR!!! ===============\n` +
          `ERROR [${new Date().toString()}]: ${msg}\n` +
          `=============== ERROR!!! ===============`
    console.error(msg.red.bgWhite);
    fs.appendFile('log.txt', msg + "\n", function (err) {
        if (err) throw err;
    });
};
Logger.prototype.w = function(msg) {
    msg = `WARN [${new Date().toString()}]: ${msg}`;
    console.warn(msg.yellow);
    fs.appendFile('log.txt', msg + "\n", function (err) {
        if (err) throw err;
    });
}

module.exports = function(debug) {
    return new Logger(debug);
}
