import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { take, map, exhaustMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private store: Store<AppState>, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store
            .select('auth')
            .pipe(
                take(1),
                map(authState => authState.token),
                exhaustMap(token => {
                    if (!token) {
                        return next.handle(req);
                    }
                    const authRequest = req.clone({
                        headers: req.headers.set('Authorization', 'Bearer ' + token)
                    });
                    return next.handle(authRequest);
                })
            );
    }
}
