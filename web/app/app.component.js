System.register(["./services/socket.service", "./controller/controller.component", 'angular2/core', "angular2/router"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var socket_service_1, controller_component_1, core_1, router_1;
    var AppComponent;
    return {
        setters:[
            function (socket_service_1_1) {
                socket_service_1 = socket_service_1_1;
            },
            function (controller_component_1_1) {
                controller_component_1 = controller_component_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(router, socketService) {
                    this.router = router;
                    this.socketService = socketService;
                    this.arduino = false;
                    this.m1Current = -1;
                    this.m2Current = -1;
                    this.temp = 0;
                    this.m1Speed = 0;
                    this.m2Speed = 0;
                    this.serialStatus = false;
                    this.vBatt = -1;
                    this.cBatt = -1;
                }
                AppComponent.prototype.ngOnInit = function () {
                    this.socketService.connect();
                    this.socket = this.socketService.getSocket();
                    $("body .mdl-navigation__link").click(function () {
                        var d = document.querySelector('.mdl-layout');
                        d.MaterialLayout.toggleDrawer();
                    });
                };
                AppComponent.prototype.ngAfterViewInit = function () {
                    componentHandler.upgradeDom();
                    var _this = this;
                    this.socket.on("status", function (status) {
                        _this.arduino = status.trim() == "connected";
                    });
                    this.socket.on("M1Current", function (current) {
                        _this.m1Current = parseFloat(current.trim());
                    });
                    this.socket.on("M2Current", function (current) {
                        _this.m2Current = parseFloat(current.trim());
                    });
                    this.socket.on("temp", function (temperature) {
                        _this.temp = parseFloat(temperature.trim());
                    });
                    this.socket.on("M1", function (data) {
                        if (data === "breaks" || data === "fault") {
                            _this.m1State = data;
                        }
                        else if (isFinite(parseInt(data))) {
                            _this.m1Speed = parseInt(data);
                            if (_this.m1State === "breaks" && _this.m1Speed !== 0) {
                                _this.m1State = "running";
                            }
                        }
                        else {
                            _this.m1State = data;
                            console.log("unknown M1 value " + data);
                        }
                    });
                    this.socket.on("M2", function (data) {
                        if (data === "breaks" || data === "fault") {
                            _this.m2State = data;
                        }
                        else if (isFinite(parseInt(data))) {
                            _this.m2Speed = parseInt(data);
                            if (_this.m2State === "breaks" && _this.m2Speed !== 0) {
                                _this.m2State = "running";
                            }
                        }
                        else {
                            _this.m2State = data;
                            console.log("unknown M2 value " + data);
                        }
                    });
                    this.socket.on("serialPort", function (status) {
                        _this.serialStatus = status.trim() == "opened";
                    });
                    this.socket.on("log", function (logs) {
                        _this.log += logs + "/n";
                    });
                    this.socket.on("VBatt", function (voltage) {
                        _this.vBatt = parseFloat(voltage.trim());
                    });
                    this.socket.on("CBatt", function (current) {
                        _this.cBatt = parseFloat(current.trim());
                    });
                    this.socket.on("serialOut", function (data) {
                        _this.serialOut = JSON.stringify(data);
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "app",
                        templateUrl: "app/app.component.html",
                        styleUrls: ["app/app.component.css"],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [
                            router_1.ROUTER_PROVIDERS, socket_service_1.SocketService
                        ]
                    }),
                    router_1.RouteConfig([
                        {
                            path: "/",
                            name: "Controller",
                            component: controller_component_1.ControllerComponent,
                            useAsDefault: true
                        }
                    ]), 
                    __metadata('design:paramtypes', [router_1.Router, socket_service_1.SocketService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map