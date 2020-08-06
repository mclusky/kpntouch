import { Injectable } from '@angular/core';
import { Router, ActivationEnd, Params, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import * as AuthActions from '../auth/ngrx/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    constructor(private router: Router, private store: Store<AppState>, private route: ActivatedRoute) {

        // Check that user has token to access password reset page
        this.router.events
            .pipe(
                filter(e => (e instanceof ActivationEnd) && (Object.keys(e.snapshot.params).length > 0)),
                map(e => e instanceof ActivationEnd ? e.snapshot.params : {})
            )
            .subscribe((params: Params) => {
                if (params.token) {
                    this.store.dispatch(AuthActions.resetPasswordActivated({ resetToken: params.token }));
                }
            });
    }
}
