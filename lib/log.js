function Logger(debug) {
    this.debug = debug;
}
Logger.prototype.d = function(msg) {
    if (this.debug) console.log(msg);
};
Logger.prototype.i = function(msg) {
    console.info(msg);
};
Logger.prototype.e = function(msg) {
    console.error(msg);
}

module.exports = function(debug) {
    return new Logger(debug);
}
