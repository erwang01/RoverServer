import {SocketService} from "./services/socket.service";
import {ControllerComponent} from "./controller/controller.component";
import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Router} from "angular2/router";

@Component({
    selector: "app",
    templateUrl: "app/app.component.html",
    styleUrls: ["app/app.component.css"],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS, SocketService
    ]
})
@RouteConfig([
    {
        path: "/",
        name: "Controller",
        component: ControllerComponent,
        useAsDefault: true
    }
])
export class AppComponent implements OnInit {
    socket: any;
    arduino: boolean = false;
    m1Current: number = -1;
    m2Current: number = -1;
    temp: number = 0;
    m1State: string;
    m1Speed: number = 0;
    m2State: string;
    m2Speed: number = 0;
    serialStatus: boolean = false;
    log: string;

    constructor(public router: Router, public socketService: SocketService) {}

    ngOnInit() {
        this.socketService.connect();
        this.socket = this.socketService.getSocket();

        $("body .mdl-navigation__link").click(function () {
            var d = document.querySelector('.mdl-layout');
            d.MaterialLayout.toggleDrawer();
        });
    }

    ngAfterViewInit() {
        componentHandler.upgradeDom();
        var _this = this;

        this.socket.on("status", function(status) {
            _this.arduino = status.trim() == "connected";
        })

        this.socket.on("M1Current", function(current) {
            _this.m1Current = parseFloat(current.trim());
        })

        this.socket.on("M2Current", function(current) {
            _this.m2Current = parseFloat(current.trim());
        })

        this.socket.on("temp", function(temperature) {
            _this.temp = parseFloat(temperature.trim());
        })

        this.socket.on("M1", function(data) {
            if(data === "breaks" || data === "fault") {
              _this.m1State = data;
            }
            else if(isFinite(parseInt(data))) {
              _this.m1Speed = parseInt(data);
              if (_this.m1State === "breaks" && _this.m1Speed !== 0) {
                _this.m1State = "running";
              }
            }
            else {
              _this.m1State = data;
              console.log("unknown M1 value " + data);
            }

        })

        this.socket.on("M2", function(data) {
          if(data === "breaks" || data === "fault") {
            _this.m2State = data;
          }
          else if(isFinite(parseInt(data))) {
            _this.m2Speed = parseInt(data);
            if (_this.m2State === "breaks" && _this.m2Speed !== 0) {
              _this.m2State = "running";
            }
          }
          else {
            _this.m2State = data;
            console.log("unknown M2 value " + data);
          }
        })

        this.socket.on("serialPort", function(status) {
            _this.serialStatus = status.trim() == "opened";
        })

        this.socket.on("log", function(logs) {
            _this.log += logs + "/n";
        })

    }
}
