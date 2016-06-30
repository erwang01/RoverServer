import {SocketService} from "../services/socket.service";
import {Component} from "angular2/core";

@Component({
    templateUrl: "app/controller/controller.component.html"
})
export class ControllerComponent {
    roverFeedSource: string = "http://192.168.15.149/html/cam_pic_new.php";
    socket: any;

    constructor(private _socketService: SocketService) {
        this.socket = this._socketService.getSocket();
    }

    ngAfterViewInit() {
        componentHandler.upgradeDom();

        var _this = this;

        this.socket.on("connect", function() {
            console.log("Connected!");
        });
        this.socket.on("disconnect", function() {
            console.log("Disconnected!");
        });
    }
}
