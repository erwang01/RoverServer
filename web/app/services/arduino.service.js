"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var rxjs_1 = require('rxjs');
/**
 * ArduinoDataLog retrieves arduino information such as
 * temperature, motor speed etc
 */
var ArduinoService = (function () {
    function ArduinoService() {
        this.status = new rxjs_1.Subject();
        this.m1Current = new rxjs_1.Subject();
        this.m2Current = new rxjs_1.Subject();
        this.temp = new rxjs_1.Subject();
        this.m1State = new rxjs_1.Subject();
        this.m1Speed = new rxjs_1.Subject();
        this.m2State = new rxjs_1.Subject();
        this.m2Speed = new rxjs_1.Subject();
        this.serialPort = new rxjs_1.Subject();
        this.log = new rxjs_1.Subject();
        this.serialOut = new rxjs_1.Subject();
        this.vBatt = new rxjs_1.Subject();
        this.cBatt = new rxjs_1.Subject();
        this.iBatt = new rxjs_1.Subject();
        this.socket = io("http://192.168.15.149:3000");
        var _this = this;
        this.socket.on("status", function (status) {
            _this.setStatus(status.trim() == "connected");
        });
        // this.socket.on("M1Current", function(current) {
        //     _this.m1Current = parseFloat(current.trim());
        // })
        //
        // this.socket.on("M2Current", function(current) {
        //     _this.m2Current = parseFloat(current.trim());
        // })
        //
        // this.socket.on("temp", function(temperature) {
        //     _this.temp = parseFloat(temperature.trim());
        // })
        //
        // this.socket.on("M1Speed", function(data) {
        //     if(data === "breaks" || data === "fault") {
        //       _this.m1State = data;
        //     }
        //     else if(isFinite(parseInt(data))) {
        //       _this.m1Speed = parseInt(data);
        //       if (_this.m1State === "breaks" && _this.m1Speed !== 0) {
        //         _this.m1State = "running";
        //       }
        //     }
        //     else {
        //       _this.m1State = data;
        //       console.log("unknown M1 value " + data);
        //     }
        //
        // })
        //
        // this.socket.on("M2Speed", function(data) {
        //   if(data === "breaks" || data === "fault") {
        //     _this.m2State = data;
        //   }
        //   else if(isFinite(parseInt(data))) {
        //     _this.m2Speed = parseInt(data);
        //     if (_this.m2State === "breaks" && _this.m2Speed !== 0) {
        //       _this.m2State = "running";
        //     }
        //   }
        //   else {
        //     _this.m2State = data;
        //     console.log("unknown M2 value " + data);
        //   }
        // })
        //
        // this.socket.on("serialPort", function(status) {
        //     _this.serialPort = status.trim() == "opened";
        // })
        //
        // this.socket.on("log", function(logs) {
        //     _this.log += logs + "/n";
        // })
        //
        // this.socket.on("VBatt", function(voltage) {
        //     _this.vBatt = parseFloat(voltage.trim());
        // })
        //
        // this.socket.on("IBatt", function(current) {
        //     _this.iBatt = parseFloat(current.trim());
        // })
        //
        // this.socket.on("CBatt", function(capacity) {
        //     _this.cBatt = parseFloat(capacity.trim());
        // })
        //
        // this.socket.on("serialOut", function(data) {
        //     _this.serialOut = JSON.stringify(data);
        // })
    }
    ArduinoService.prototype.reconnectSerialPort = function () {
        this.socket.emit("reconnectSerialPort");
    };
    ArduinoService.prototype.setStatus = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setM1Current = function (current) {
        this.m1Current.next(current);
    };
    ArduinoService.prototype.setM2Current = function (current) {
        this.m2Current.next(current);
    };
    ArduinoService.prototype.setTemp = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setM1State = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setM1Speed = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setM2State = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setM2Speed = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setSerialPort = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setLog = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setSerialOut = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setVBatt = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setCBatt = function (status) {
        this.status.next(status);
    };
    ArduinoService.prototype.setIBatt = function (status) {
        this.status.next(status);
    };
    ArduinoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ArduinoService);
    return ArduinoService;
}());
exports.ArduinoService = ArduinoService;
//# sourceMappingURL=arduino.service.js.map