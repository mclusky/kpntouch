import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { UINotifications } from '../dialogs/notifications';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket: any;
    readonly uri: string = 'https://kpntouch.herokuapp.com';

    constructor(
        private UINotif: UINotifications
    ) {
        this.socket = io(this.uri);
    }

    listen(eventName: string) {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    emit(eventName: string, data) {
        this.socket.emit(eventName, data, (err) => {
            if (err) {
                this.UINotif.showSnackBar('Oups, there was an eror', `${err}`);
            }
        });
    }
}
