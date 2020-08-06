import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, } from 'rxjs';
import { tap, filter, first, finalize, map, withLatestFrom } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import { selectTopicGroups, isTopicLoaded, selectGroupById, } from './group.selectors';
import * as GroupActions from './group.actions';
import * as PostActions from '../../posts/ngrx/post.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';

@Injectable()
export class GroupResolver implements Resolve<any> {
    isLoading = false;
    constructor(
        private router: Router,
        private store: Store<AppState>
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const topic = route.queryParams['topic'];
        const id = route.paramMap.get('groupId');
        if (topic) {
            return this.store
                .pipe(
                    select(isTopicLoaded, { topic }),
                    withLatestFrom(
                        this.store.pipe(select(selectTopicGroups, { topic })),
                    ),
                    tap(([loaded, groups]) => {
                        if (!loaded && !this.isLoading && !id) {
                            this.isLoading = true;
                            this.store.dispatch(GroupActions.getTopicGroups({ topic, pageNumber: 1, pageSize: 20 }));
                            this.store.dispatch(SpinnerActions.startSpinner());
                        }
                    }),
                    filter(([loaded, groups]) => !!loaded),
                    map(([loaded, groups]) => {
                        // Offer to create a group if the array is empty //
                        if (groups.length === 0) {
                            this.router.navigate(['/groups/create'], {
                                queryParams: {
                                    empty: true,
                                    topic
                                }
                            });
                            return false;
                        }
                    }),
                    first(),
                    finalize(() => this.isLoading = false));
        } else if (id) {
            return this.store
                .pipe(
                    select(selectGroupById, { id }),
                    tap(group => {
                        if (!group) {
                            this.isLoading = true;
                            this.store.dispatch(GroupActions.getSingleGroup({ groupId: id }));
                            this.store.dispatch(PostActions.getGroupPosts({ groupId: id, pageNumber: 1, pageSize: 20 }));
                        }
                    }),
                    filter(group => !!group),
                    first(),
                    finalize(() => this.isLoading = false));
        }
    }
}
