import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { canSeeGroup, canEditGroup } from '../components/user/ngrx/user.selectors';
import { AppState } from '../store/app.reducers';
import { tap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MessagesComponent } from '../dialogs/messages/messages.component';
import { CreateGroupComponent } from '../components/groups/create-group/create-group.component';
import { CheckComponent } from '../dialogs/check/check.component';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GroupsGuard implements CanActivate, CanDeactivate<CreateGroupComponent> {

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private dialog: MatDialog,
        private authService: AuthService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!route.queryParams['new'] && !route.queryParams['topic'] && !route.params['groupId'] && !route.queryParams['category']) {
            this.router.navigate(['home']);
            return false;
        }
        // Check ownership for editing group //
        if (route.params['groupId'] && route.url[0].path === 'create') {
            return this.store.pipe(
                select(canEditGroup, { id: route.params['groupId'] }),
                tap(isAllowed => {
                    if (!isAllowed) {
                        this.dialog.open(MessagesComponent, {
                            data: {
                                header: 'Acces Denied!',
                                message: 'You can\'t do that.'
                            }
                        });
                        this.router.navigate(['home']);
                        return false;
                    }
                    return true;
                })
            );
        }
        // Check either ownership or membership //
        if (route.params['groupId']) {
            return this.store.pipe(
                select(canSeeGroup, { id: route.params['groupId'] }),
                tap(isAllowed => {
                    if (!isAllowed) {
                        this.dialog.open(MessagesComponent, {
                            data: {
                                header: 'Acces Denied!',
                                message: 'You can\'t do that.'
                            }
                        });
                        this.router.navigate(['home']);
                        return false;
                    }
                    return true;
                }));
        }
        return true;
    }

    canDeactivate(
        component: CreateGroupComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const updated = component.groupUpdated;
        if (component.form.dirty && !route.queryParams['new'] && !updated) {
            const dialogRef = this.dialog.open(CheckComponent, {
                data: {
                    user: 'Easy...',
                    message: 'You haven\'t saved your changes.',
                    action: 'Quit'
                }
            });
            return dialogRef.afterClosed().pipe(map(result => result));
        }
        return true;
    }
}
