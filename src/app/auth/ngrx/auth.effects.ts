import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { tap, switchMap, map, catchError, take, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { User } from 'src/app/models/user.model';

import * as AuthActions from './auth.actions';
import * as UserActions from '../../components/user/ngrx/user.actions';

import { AuthService } from 'src/app/services/auth.service';
import { AuthData } from 'src/app/models/auth.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { UINotifications } from 'src/app/dialogs/notifications';
import { RouteService } from 'src/app/services/route.service';

const BACKEND_URL = environment.api_url;

@Injectable()
export class AuthEffects {
    signup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.trySignup),
                switchMap(action => {
                    return this.http
                        .post(`${BACKEND_URL}/users/signup`, action.payload)
                        .pipe(
                            map(response => {
                                this.UINotificatins.showSnackBar('You have signed up succesfuly.', '🤓');
                                this.router.navigate(['/login']);
                                return {
                                    type: AuthActions.SIGNUP_SUCCESS
                                };
                            }),
                            catchError(err => this.handleError(err))
                        );
                }),
            ),
    );

    tryLogin$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.tryLogin),
                switchMap((action) => {
                    return this.http.post<{ auth: AuthData, user: User }>(`${BACKEND_URL}/users/login`, {
                        email: action.email,
                        password: action.password
                    })
                        .pipe(
                            tap(response => {
                                this.router.navigate(['/home']);
                                /*
                                Set a timer to auto logout the user
                                2 minutes before token expiration on server
                                */
                                this.authService.setLogoutTimer((+response.auth.token_expiration - 300) * 1000);
                            }
                            ),
                            map(response => {
                                this.UINotificatins.showSnackBar('You are now logged in. 😀', 'WOOP!');
                                this.handleAuthentication(response.auth, response.user);
                                // Save User info in store //
                                this.store
                                    .dispatch(UserActions
                                        .setUserGroups({ groups: response.user.userGroups }));

                                this.store
                                    .dispatch(UserActions
                                        .setUserGroupsJoined({ groups: response.user.groupsJoined }));

                                // Save auth info in store //
                                return {
                                    type: AuthActions.LOGIN_SUCCESS_SET_AUTH,
                                    authData: response.auth
                                };
                            }),
                            catchError(err => this.handleError(err))
                        );
                }),
            ),
    );

    logout$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.logout),
                switchMap(action => {
                    return this.http.post(`${BACKEND_URL}/users/logout`, {})
                        .pipe(
                            take(1),
                            tap(() => {
                                this.authService.clearLogoutTimeout();
                                // Clear Local Storage //
                                localStorage.removeItem('userData');
                                localStorage.removeItem('authData');
                                this.router.navigate(['/login']);
                            }),
                            map(response => {
                                this.UINotificatins.showSnackBar('You are now logged out. 😢', 'See you later!');
                                return {
                                    type: AuthActions.CLEAR_AUTH
                                };
                            }),
                            catchError(err => this.handleError(err))
                        );
                })
            ),
    );

    resetPassword$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.resetPassword),
                switchMap(action => {
                    return this.http.post(`${BACKEND_URL}/users/forgot`, { email: action.email })
                        .pipe(
                            map(response => {
                                if (!!response) {
                                    return {
                                        type: AuthActions.RESET_PASSWORD_SUCCESS
                                    };
                                } else {
                                    return {
                                        type: AuthActions.RESET_PASSWORD_FAILED
                                    };
                                }
                            })
                        );
                })
            )
    );

    setNewPassword$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.setNewPassword),
                switchMap(action => {
                    return this.http
                        .post(`${BACKEND_URL}/users/reset-password`,
                            {
                                resetToken: action.resetToken,
                                password: action.password,
                                confirmPassword: action.confirmPassword
                            })
                        .pipe(
                            map(response => {
                                this.router.navigate(['/login']);
                                this.UINotificatins.showSnackBar('Password updated successfully', 'Wooohoo! 😎');
                                return {
                                    type: AuthActions.RESET_PASSWORD_SUCCESS
                                };
                            }),
                            catchError(err => this.handleError(err))
                        );
                })
            )
    );

    private handleAuthentication = (auth: AuthData, user: User) => {
        // Set user data in localStorage //
        const expirationDate = new Date(new Date().getTime() + (+auth.token_expiration * 1000));
        const userData = {
            groupsJoined: user.groupsJoined,
            userGroups: user.userGroups
        };
        const authData = {
            token: auth.token,
            token_expiration: expirationDate,
            userId: auth.userId,
            username: auth.username,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authData', JSON.stringify(authData));
    }

    private handleError = (errorRes: any) => {
        if (!errorRes.error || !errorRes.error.error) {
            this.router.navigate(['/']);
            return of({
                type: AuthActions.AUTH_FAILED,
                payload: {
                    message: 'Unknown Error'
                }
            });
        }
        this.router.navigate(['/']);
        return of({
            type: AuthActions.AUTH_FAILED,
            payload: {
                message: errorRes.error.message
            }
        });
    }

    constructor(
        private actions$: Actions,
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private routeService: RouteService,
        private store: Store<AppState>,
        private UINotificatins: UINotifications,
    ) {

    }
}
