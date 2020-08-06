import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

import * as UserActions from './user.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';
import * as GroupActions from '../../groups/ngrx/group.actions';

import { environment } from 'src/environments/environment';
import { Group } from 'src/app/models/group.model';
import { UINotifications } from 'src/app/dialogs/notifications';
import { AppState } from 'src/app/store/app.reducers';

const BACKEND_URL = environment.api_url;

@Injectable()
export class USerEffects {
    topic: string;
    groupId: string;

    joinGroup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.joinGroup),
                switchMap(action => {
                    return this.http
                        .post(`${BACKEND_URL}/users/group-joined`, {
                            groupId: action.groupId
                        })
                        .pipe(
                            map(response => {
                                this.store.dispatch(GroupActions.addGroupMember({ groupId: action.groupId }));
                                return {
                                    type: UserActions.JOIN_GROUP_SUCCESS,
                                    group: response
                                };
                            }),
                            catchError(err => this.handleError(err, UserActions.JOIN_GROUP_FAILED))
                        );
                })
            ),
    );
    joinGroupSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.joinGroupSuccess),
                map(action => {
                    // Update Local Storage //
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    userData.groupsJoined.push(action.group);
                    localStorage.setItem('userData', JSON.stringify(userData));

                    this.router.navigate([`/groups/${action.group._id}`], {
                        queryParams: {
                            joined: true
                        }
                    });
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    createGroup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.createGroup),
                switchMap(action => {
                    return this.http.post<{ group: Group, message: string }>(`${BACKEND_URL}/groups`, action.group)
                        .pipe(
                            map(response => {
                                this.store
                                    .dispatch(GroupActions.createGroupEntity({ group: response.group }));
                                return {
                                    type: UserActions.CREATE_GROUP_SUCCESS,
                                    group: response.group
                                };
                            }),
                            catchError(err => this.handleError(err, UserActions.CREATE_GROUP_FAILED))
                        );
                })
            )
    );

    createGroupSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.createGroupSuccess),
                map(action => {
                    this.UiNotifications.showSnackBar('Group Created Successfuly.', 'Get Writing!');
                    // Update the array in local storage too //
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    userData.userGroups.push(action.group);
                    localStorage.setItem('userData', JSON.stringify(userData));
                    this.router.navigate([`/groups/user-groups`], {
                        queryParams: {
                            category: 'created'
                        }
                    });
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    updateGroup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.updateGroup),
                switchMap(action => {
                    return this.http.patch<{ group: Group, message: string }>(`${BACKEND_URL}/groups`, action.group)
                        .pipe(
                            map(response => {
                                this.store
                                    .dispatch(GroupActions.updateGroupEntity({ group: response.group }));
                                return {
                                    type: UserActions.UPDATE_GROUP_SUCCESS,
                                    group: response.group
                                };
                            }),
                            catchError(err => this.handleError(err, UserActions.UPDATE_GROUP_FAILED))
                        );
                })
            )
    );

    updateGroupSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.updateGroupSuccess),
                map(action => {
                    this.UiNotifications.showSnackBar('Group Updated Successfuly.', 'Sweeet!');
                    // Update the array in local storage too //
                    const userData = JSON.parse(localStorage.getItem('userData'));

                    const newUserGroups = [...userData.userGroups]
                        .map((g: Group) => g._id === action.group._id ? { ...action.group } : g);

                    const newUserData = {
                        ...userData,
                        userGroups: newUserGroups
                    };
                    localStorage.setItem('userData', JSON.stringify(newUserData));
                    this.router.navigate([`/groups/user-groups`], {
                        queryParams: {
                            category: 'created'
                        }
                    });
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    leaveGroup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.leaveGroup),
                switchMap(action => {
                    return this.http
                        .patch<{ group: Group }>(`${BACKEND_URL}/users/leave-group`, { groupId: action.groupId })
                        .pipe(
                            map(response => {
                                this.UiNotifications
                                    .showSnackBar('Good Bye', '😎');
                                this.store
                                    .dispatch(GroupActions.deleteGroupMember({ groupId: action.groupId }));
                                return {
                                    type: UserActions.LEAVE_GROUP_SUCCESS,
                                    group: response.group
                                };
                            }),
                            catchError(err => this.handleError(err, UserActions.LEAVE_GROUP_FAILED))
                        )
                })
            )
    );

    leaveGroupSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.leaveGroupSuccess),
            map(action => {
                // Update local storage //
                const userData = JSON.parse(localStorage.getItem('userData'));
                const newGroupsJoined = [...userData.groupsJoined]
                    .filter((g: Group) => g._id !== action.group._id);

                const newUserData = {
                    ...userData,
                    groupsJoined: newGroupsJoined
                };
                localStorage.setItem('userData', JSON.stringify(newUserData));
                this.router.navigate(['/groups/user-groups'], {
                    queryParams: {
                        category: 'joined'
                    }
                });
                return {
                    type: SpinnerActions.STOP_SPINNER
                };
            })
        )
    );

    deleteGroup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.deleteGroup),
                switchMap(action => {
                    return this.http.delete<{ group: Group }>(`${BACKEND_URL}/groups/${action.groupId}`)
                        .pipe(
                            map(response => {
                                this.store
                                    .dispatch(GroupActions.deleteGroupEntity(
                                        { groupId: response.group._id }
                                    ));

                                this.UiNotifications
                                    .showSnackBar('Group deleted successfuly', '😎');
                                return {
                                    type: UserActions.DELETE_GROUP_SUCCESS,
                                    group: response.group
                                };
                            }),
                            catchError(err => this.handleError(err, UserActions.DELETE_GROUP_FAILED))
                        );
                })
            )
    );

    deleteGroupSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(UserActions.deleteGroupSuccess),
                map(action => {
                    // Update local storage //
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    const newUserGroups = [...userData.userGroups]
                        .filter((g: Group) => g._id !== action.group._id);

                    const newUserData = {
                        ...userData,
                        userGroups: newUserGroups
                    };
                    localStorage.setItem('userData', JSON.stringify(newUserData));
                    this.router.navigate([`/groups/user-groups`], {
                        queryParams: {
                            category: 'created'
                        }
                    });
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    private handleError = (errorRes: any, action) => {
        console.log('error:', errorRes);
        this.store.dispatch(SpinnerActions.stopSpinner());
        if (!errorRes.error || !errorRes.error.error) {
            this.router.navigate(['/groups'], { queryParams: { topic: this.topic } });
            return of({
                type: action,
                payload: {
                    message: 'Unknown Error'
                }
            });
        }
        this.router.navigate(['/groups'], { queryParams: { topic: this.topic } });
        return of({
            type: action,
            payload: {
                message: errorRes.error.message
            }
        });
    }
    constructor(
        private actions$: Actions,
        private router: Router,
        private http: HttpClient,
        private UiNotifications: UINotifications,
        private store: Store<AppState>
    ) { }
}

