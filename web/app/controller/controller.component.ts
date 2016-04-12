import {Component} from "angular2/core";

@Component({
    templateUrl: "app/controller/controller.component.html"
})
export class ControllerComponent {
    roverFeedSource: string;
    logs: string[] = [];

    ngAfterViewInit() {
        componentHandler.upgradeDom();

        var socket = io();
        var _this = this;

        socket.on("connect", function() {
            console.log("Connected!");
        });
        socket.on("disconnect", function() {
            console.log("Disconnected!");
        });

        socket.on("log", function(log) {
            _this.logs.push(log);
        });
    }
}
