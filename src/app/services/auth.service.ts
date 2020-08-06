import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import * as AuthActions from '../auth/ngrx/auth.actions';
import { UINotifications } from '../dialogs/notifications';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenExpirationTimer: any;
    private msgTimer: any;

    constructor(
        private store: Store<AppState>,
        private UINotif: UINotifications
    ) { }

    clearLogoutTimeout() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            clearTimeout(this.msgTimer);
            this.tokenExpirationTimer = null;
            this.msgTimer = null;
        }
    }

    // Set timer to auto logout user when JWT totken expires //
    setLogoutTimer(expirationDuration: number) {
        // Warn user about auto logout before hand //
        const msgExp = expirationDuration - 20000;

        this.msgTimer = setTimeout(() => {
            this.UINotif.showSnackBar('Time\'s up!', 'You\'re about to be logged out.')
        }, msgExp);

        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(AuthActions.logout());
        }, expirationDuration - 10000);
    }

    // Fetch user from local storage
    getUser() {
        return JSON.parse(localStorage.getItem('authData'));
    }

}
