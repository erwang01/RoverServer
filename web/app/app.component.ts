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
    connected: boolean = false;

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
            _this.connected = status == "connected";
        });
    }
}
