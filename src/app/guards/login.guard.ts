import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { isLoggedIn } from '../auth/ngrx/auth.selectors';
import { take, map } from 'rxjs/operators';

// ONLY SHOW LOGIN PAGE IF USER IS NOT ALREADY LOGGED IN //

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.store.select(isLoggedIn)
            .pipe(
                take(1),
                map(auth => {
                    if (auth) {
                        return this.router.createUrlTree(['/home']);
                    } else {
                        return true;
                    }
                })
            );
    }
}
