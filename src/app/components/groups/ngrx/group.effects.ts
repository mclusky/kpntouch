import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { Group } from 'src/app/models/group.model';

import * as GroupActions from './group.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';

import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.api_url;
@Injectable()
export class GroupEffects {
    topic: string;
    groupId: string;

    getTopicGroups$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(GroupActions.getTopicGroups),
                switchMap(action => {
                    this.topic = action.topic;
                    return this.http
                        .get<{ groups: Group[], count: number }>(
                            `${BACKEND_URL}/groups/${this.topic}?pageNumber=${action.pageNumber}&pageSize=${action.pageSize}`)
                        .pipe(
                            map(response => {
                                return {
                                    type: GroupActions.GET_TOPIC_GROUPS_SUCCESS,
                                    groups: response.groups,
                                    topic: this.topic,
                                    count: response.count,
                                    groupsLoaded: response.groups.length
                                };
                            }),
                            catchError(err => this.handleError(err, GroupActions.GET_TOPIC_GROUPS_FAILED))
                        );
                })
            )
    );

    getTopicGroupSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(GroupActions.getTopicGroupsSuccess),
                map(action => {
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    getSingleGroup$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(GroupActions.getSingleGroup),
                switchMap(action => {
                    return this.http.get<{ group: Group, count: number }>(`${BACKEND_URL}/groups/single/${action.groupId}`)
                        .pipe(
                            map(response => {
                                return {
                                    type: GroupActions.GET_SINGLE_GROUP_SUCCESS,
                                    group: response.group,
                                    count: response.count
                                };
                            }),
                            catchError(err => this.handleError(err, GroupActions.GET_SINGLE_GROUP_FAILED))
                        );
                })
            )
    )

    private handleError = (errorRes: any, type) => {
        console.log(errorRes);

        if (!errorRes.error || !errorRes.error.error) {
            this.router.navigate(['/home']);
            return of({
                type,
                payload: {
                    message: 'Unknown Error'
                }
            });
        }
        this.router.navigate(['/home']);
        return of({
            type,
            payload: {
                message: errorRes.error.message
            }
        });
    }

    constructor(
        private actions$: Actions,
        private router: Router,
        private http: HttpClient,
    ) { }
}
