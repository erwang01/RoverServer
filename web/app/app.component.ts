import {ArduinoService} from "./services/arduino.service";
import {ControllerComponent} from "./controller/controller.component";
import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from "@angular/router";

@Component({
    selector: "app",
    templateUrl: "app/app.component.html",
    styleUrls: ["app/app.component.css"],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ArduinoService
    ]
})
export class AppComponent implements OnInit {
    arduinoStatus: boolean = false;
    m1Current: number = -1;
    m2Current: number = -1;
    temp: number = 0;
    m1State: string;
    m1Speed: number = 0;
    m2State: string;
    m2Speed: number = 0;
    serialPort: boolean = false;
    log: string;
    serialOut: string;
    vBatt: number = -1;
    cBatt: number = -1;
    iBatt: number = -1;


    constructor(public arduinoService: ArduinoService) {}

    ngOnInit() {
        $("body .mdl-navigation__link").click(function () {
            var d = document.querySelector('.mdl-layout');
            d.MaterialLayout.toggleDrawer();
        });
    }

    ngAfterViewInit() {
        componentHandler.upgradeDom();
        var _this = this;

        this.arduinoService.status.subscribe((status) => {
            _this.arduinoStatus = status;
        });
    }

    reconnectSerialPort() {
        this.arduinoService.reconnectSerialPort();
    }
}
