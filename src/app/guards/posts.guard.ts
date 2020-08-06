import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateGroupComponent } from '../components/groups/create-group/create-group.component';
import { MatDialog } from '@angular/material/dialog';
import { CheckComponent } from '../dialogs/check/check.component';
import { map, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { MessagesComponent } from '../dialogs/messages/messages.component';
import { canSeeGroup } from '../components/user/ngrx/user.selectors';

@Injectable({
    providedIn: 'root'
})
export class PostsGuard implements CanActivate, CanDeactivate<CreateGroupComponent> {
    constructor(
        private router: Router,
        private dialog: MatDialog,
        private store: Store<AppState>
    ) { }


    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const groupId = route.paramMap.get('groupId');
        const postId = route.paramMap.get('postId');
        if (!groupId && !postId) {
            this.router.navigate(['/home']);
            return false;
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
        if (component.form.dirty) {
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
