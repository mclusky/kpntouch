import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Post } from 'src/app/models/post.model';

import * as PostActions from './post.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';
import * as GroupActions from '../../groups/ngrx/group.actions';
import { AppState } from 'src/app/store/app.reducers';

const BACKEND_URL = environment.api_url;

@Injectable()
export class PostEffects {

    createPost$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.createPost),
                switchMap(action => {
                    return this.http
                        .post<{ message: string, post: Post }>(`${BACKEND_URL}/posts`, action.post)
                        .pipe(
                            map(response => {
                                return {
                                    type: PostActions.CREATE_POST_SUCCESS,
                                    post: response.post
                                };
                            }),
                            catchError(err => this.handleError(err, PostActions.CREATE_POST_FAILED))
                        );
                })
            )
    );

    createPostSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.createPostSuccess),
                map(action => {
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    getGroupPosts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostActions.getGroupPosts),
            switchMap(action => {
                return this.http
                    .get<{ posts: Post[] }>
                    (`${BACKEND_URL}/posts/${action.groupId}?pageSize=${action.pageSize}&currentPage=${action.pageNumber}`)
                    .pipe(
                        map(response => {
                            this.store.dispatch(GroupActions.groupPostsLoaded({ groupId: action.groupId }));
                            return {
                                type: PostActions.GET_GROUP_POSTS_SUCCESS,
                                posts: response.posts
                            };
                        }),
                        catchError(err => this.handleError(err, PostActions.GET_GROUP_POSTS_FAILED))
                    );
            })
        )
    );

    getGroupPostsSucess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.getGroupPostsSuccess),
                map(action => {
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    getSinglePost$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.getSinglePost),
                switchMap(action => {
                    return this.http.get<{ post: Post }>(`${BACKEND_URL}/posts/single/${action.postId}`)
                        .pipe(
                            map(response => {
                                return {
                                    type: PostActions.GET_SINGLE_POST_SUCCESS,
                                    post: response
                                };
                            }),
                            catchError(err => this.handleError(err, PostActions.GET_SINGLE_POST_FAILED))
                        );
                })
            )
    );

    getSinglePostSuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.getSinglePostSuccess),
                map(action => {
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    updatePost$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.updatePost),
                switchMap(action => {
                    return this.http
                        .patch<{ post: Post }>(`${BACKEND_URL}/posts/${action.id}`, action.post)
                        .pipe(
                            map(response => {
                                return {
                                    type: PostActions.UPDATE_POST_SUCCESS,
                                    post: response
                                };
                            }),
                            catchError(err => this.handleError(err, PostActions.UPDATE_POST_FAILED))
                        );
                })
            )
    );

    updatePostSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostActions.updatePostSuccess),
            map(action => {
                return {
                    type: SpinnerActions.STOP_SPINNER
                };
            })
        )
    );

    deletePost$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.deletePost),
                switchMap(action => {
                    return this.http.delete<{ post: Post }>(`${BACKEND_URL}/posts/${action.postId}`)
                        .pipe(
                            map(response => {
                                return {
                                    type: PostActions.DELETE_POST_SUCCESS,
                                    postId: response.post._id
                                };
                            }),
                            catchError(err => this.handleError(err, PostActions.DELETE_POST_FAILED))
                        );
                })
            )
    );

    deletePostsuccess$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(PostActions.deletePostSuccess),
                map(action => {
                    return {
                        type: SpinnerActions.STOP_SPINNER
                    };
                })
            )
    );

    private handleError = (errorRes: any, action) => {
        this.store.dispatch(SpinnerActions.stopSpinner());
        if (!errorRes.error || !errorRes.error.error) {
            this.router.navigate(['/home']);
            return of({
                type: action,
                payload: {
                    message: 'Unknown Error'
                }
            });
        }
        this.router.navigate(['/home']);
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
        private store: Store<AppState>
    ) { }

}