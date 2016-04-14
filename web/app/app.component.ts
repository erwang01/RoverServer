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
    m1: any;
    m2: any;
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
            _this.arduino = status == "connected";
        })

        this.socket.on("M1Current", function(current) {
            _this.m1Current = parseFloat(current);
        })

        this.socket.on("M2Current", function(current) {
            _this.m2Current = parseFloat(current);
        })

        this.socket.on("temp", function(temperature) {
            _this.temp = parseFloat(temperature);
        })

        this.socket.on("M1", function(data) {
            _this.m1 = data;
        })

        this.socket.on("M2", function(data) {
            _this.m2 = data;
        })

        this.socket.on("serialPort", function(status) {
            _this.serialStatus = status == "opened";
        })

        this.socket.on("log", function(logs) {
            _this.log += logs + "/n";
        })

    }
}
