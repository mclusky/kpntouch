import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/store/app.reducers';
import * as AuthActions from '../ngrx/auth.actions';
import { isLoggedIn, loading } from '../ngrx/auth.selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
    isLoading$: Observable<boolean>;
    isNavigating: boolean;
    reset = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private authService: AuthService,
    ) {
        this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.isNavigating = true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.isNavigating = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    ngOnInit() {
        this.isLoading$ = this.store.pipe(select(loading));
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.store.dispatch(AuthActions.tryLogin({ email: form.value.email, password: form.value.password }));
    }

    onReset(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.store.dispatch(AuthActions.resetPassword({ email: form.value.emailReset }));
    }
}
