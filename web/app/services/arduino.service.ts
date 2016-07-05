import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

/**
 * ArduinoDataLog retrieves arduino information such as
 * temperature, motor speed etc
 */
@Injectable()
export class ArduinoService {
    socket: any;
    status: Subject<boolean>     = new Subject<boolean>();
    m1Current: Subject<number>   = new Subject<number>();
    m2Current: Subject<number>   = new Subject<number>();
    temp: Subject<number>        = new Subject<number>();
    m1State: Subject<string>     = new Subject<string>();
    m1Speed: Subject<number>     = new Subject<number>();
    m2State: Subject<string>     = new Subject<string>();
    m2Speed: Subject<number>     = new Subject<number>();
    serialPort: Subject<boolean> = new Subject<boolean>();
    log: Subject<string>         = new Subject<string>();
    serialOut: Subject<string>   = new Subject<string>();
    vBatt: Subject<number>       = new Subject<number>();
    cBatt: Subject<number>       = new Subject<number>();
    iBatt: Subject<number>       = new Subject<number>();

    constructor() {
        this.socket = io("http://192.168.15.149:3000");
        var _this = this;

        this.socket.on("status", function(status) {
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

    public reconnectSerialPort(): void {
        this.socket.emit("reconnectSerialPort");
    }

    public setStatus(status: boolean): void {
        this.status.next(status);
    }

    public setM1Current(current: number): void {
        this.m1Current.next(current);
    }

    public setM2Current(current: number): void {
        this.m2Current.next(current);
    }

    public setTemp(status: boolean): void {
        this.status.next(status);
    }

    public setM1State(status: boolean): void {
        this.status.next(status);
    }

    public setM1Speed(status: boolean): void {
        this.status.next(status);
    }

    public setM2State(status: boolean): void {
        this.status.next(status);
    }

    public setM2Speed(status: boolean): void {
        this.status.next(status);
    }

    public setSerialPort(status: boolean): void {
        this.status.next(status);
    }

    public setLog(status: boolean): void {
        this.status.next(status);
    }

    public setSerialOut(status: boolean): void {
        this.status.next(status);
    }

    public setVBatt(status: boolean): void {
        this.status.next(status);
    }

    public setCBatt(status: boolean): void {
        this.status.next(status);
    }

    public setIBatt(status: boolean): void {
        this.status.next(status);
    }
}
