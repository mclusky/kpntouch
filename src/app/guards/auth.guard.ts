import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { AppState } from '../store/app.reducers';
import { isLoggedIn } from '../auth/ngrx/auth.selectors';
import { AuthData } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../auth/ngrx/auth.actions';
import * as UserActions from '../components/user/ngrx/user.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Check for user data in localstorage
        const authData: AuthData = JSON.parse(localStorage.getItem('authData'));
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!authData) {
            this.router.navigate(['/']);
        }
        // Creating a new Date object from the local storage string//
        const loadedAuthData: AuthData = {
            ...authData,
            token_expiration: new Date(authData.token_expiration)
        };
        // Checking if token has expired //
        if (!loadedAuthData.token_expiration || new Date() > loadedAuthData.token_expiration) {
            localStorage.removeItem('authData');
            localStorage.removeItem('userData');
            this.router.navigate(['/']);
            this.store.dispatch(AuthActions.loginRefreshFailed());
        }
        // Set auto logout timer
        const expiresIn = new Date(loadedAuthData.token_expiration).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expiresIn);
        // Reset user info in store
        this.store.dispatch(AuthActions.setAuth({ authData: loadedAuthData }));

        this.store
            .dispatch(UserActions.setUserGroupsJoined({ groups: userData.groupsJoined }));
        this.store
            .dispatch(UserActions.setUserGroups({ groups: userData.userGroups }));
        return this.store
            .pipe(select(isLoggedIn),
                tap(auth => auth ? true : this.router.createUrlTree(['/login']))
            );
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store
            .pipe(select(isLoggedIn),
                tap(auth => auth ? true : this.router.createUrlTree(['/login']))
            );
    }
}
