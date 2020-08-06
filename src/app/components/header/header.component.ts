import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { map } from 'rxjs/operators';
import * as AuthActions from '../../auth/ngrx/auth.actions';
import { isLoggedIn } from 'src/app/auth/ngrx/auth.selectors';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    inGroup = false;
    subscription: Subscription;
    userId: string;
    btnClicked = false;
    timer: any;

    constructor(
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.subscription = this.store
            .select('auth')
            .pipe(
                map(authState => authState)
            )
            .subscribe(auth => {
                this.userId = auth ? auth.userId : '';
                this.isLoggedIn = !!auth.userId;
            });
    }

    onLogout() {
        if (!this.btnClicked && isLoggedIn) {
            this.store.dispatch(AuthActions.logout());
            this.btnClicked = true;
        }
       this.timer = setTimeout(() => {
            this.btnClicked = false;
        }, 1000);
    }

    ngOnDestroy() {
        clearTimeout(this.timer);
        this.subscription.unsubscribe();
    }

}
