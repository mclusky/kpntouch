import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';

import { CheckComponent } from '../dialogs/check/check.component';
import * as UserActions from '../components/user/ngrx/user.actions';
import * as SpinnerActions from '../store/spinner/spinner.actions';
@Injectable({
    providedIn: 'root'
})

export class GroupService {

    constructor(
        private dialog: MatDialog,
        private store: Store<AppState>
    ) { }

    deleteGroup(id: string) {
        const username = JSON.parse(localStorage.getItem('authData')).username;
        const dialogRef = this.dialog.open(CheckComponent, { data: { user: username, message: 'Delete this group', action: 'Delete' } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(UserActions.deleteGroup({ groupId: id }));
                this.store.dispatch(SpinnerActions.startSpinner());
            }
        });
    }

    leaveGroup(id: string) {
        const username = JSON.parse(localStorage.getItem('authData')).username;
        const dialogRef = this.dialog.open(CheckComponent, { data: { user: username, message: 'Leave this group', action: 'Leave' } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(UserActions.leaveGroup({ groupId: id }));
                this.store.dispatch(SpinnerActions.startSpinner());
            }
        });
    }

}
