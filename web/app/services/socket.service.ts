import {Injectable} from "angular2/core";

@Injectable()
export class SocketService {
    socket: any;

    connect(url: string = "http://192.168.15.149:3000") {
        this.socket = io(url);
    }

    getSocket(): any {
        return this.socket;
    }
}
