var colors = require("colors");

function Logger(debug) {
    this.debug = debug;
}
Logger.prototype.d = function(msg) {
    if (this.debug) {
        msg = `DEBUG [${new Date().toString()}]: ${msg}`;
        console.log(msg.cyan);
    }
};
Logger.prototype.i = function(msg) {
    console.info(msg);
};
Logger.prototype.e = function(msg) {
    msg = `=============== ERROR!!! ===============\n` +
          `ERROR [${new Date().toString()}]: ${msg}\n` +
          `=============== ERROR!!! ===============`
    console.error(msg.red.bgWhite);
};
Logger.prototype.w = function(msg) {
    msg = `WARN [${new Date().toString()}]: ${msg}`;
    console.warn(msg.yellow);
}

module.exports = function(debug) {
    return new Logger(debug);
}
