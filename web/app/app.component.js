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
var arduino_service_1 = require("./services/arduino.service");
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var AppComponent = (function () {
    function AppComponent(arduinoService) {
        this.arduinoService = arduinoService;
        this.arduinoStatus = false;
        this.m1Current = -1;
        this.m2Current = -1;
        this.temp = 0;
        this.m1Speed = 0;
        this.m2Speed = 0;
        this.serialPort = false;
        this.vBatt = -1;
        this.cBatt = -1;
        this.iBatt = -1;
    }
    AppComponent.prototype.ngOnInit = function () {
        $("body .mdl-navigation__link").click(function () {
            var d = document.querySelector('.mdl-layout');
            d.MaterialLayout.toggleDrawer();
        });
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeDom();
        var _this = this;
        this.arduinoService.status.subscribe(function (status) {
            _this.arduinoStatus = status;
        });
    };
    AppComponent.prototype.reconnectSerialPort = function () {
        this.arduinoService.reconnectSerialPort();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "app",
            templateUrl: "app/app.component.html",
            styleUrls: ["app/app.component.css"],
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [
                arduino_service_1.ArduinoService
            ]
        }), 
        __metadata('design:paramtypes', [arduino_service_1.ArduinoService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map