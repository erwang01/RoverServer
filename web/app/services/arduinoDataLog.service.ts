import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

/**
 * ArduinoDataLog retrieves arduino information such as
 * temperature, motor speed etc
 */
@Injectable()
export class ArduinoDataLogService {
    socket: any;
    status: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this.socket = io("http://192.168.15.149:3000");
        var _this = this;

        this.socket.on("status", function(status) {
            _this.setStatus(status.trim() == "connected");
        });
    }

    public setStatus(status: boolean): void {
        this.status.next(status);
    }
}
