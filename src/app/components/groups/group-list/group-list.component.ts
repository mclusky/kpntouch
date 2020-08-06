import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, filter, withLatestFrom, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/models/group.model';

import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { selectTopicGroups, totalGroups, groupsAlreadyLoaded } from '../ngrx/group.selectors';
import { isLoading } from 'src/app/store/spinner/spinner.selectors';
import * as UserActions from '../../user/ngrx/user.actions';
import * as GroupActions from '../ngrx/group.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';
import { selectGroupsJoined } from '../../user/ngrx/user.selectors';
import { GroupService } from 'src/app/services/group.service';


@Component({
    selector: 'app-group-list',
    templateUrl: './group-list.component.html',
    styleUrls: ['./group-list.component.sass']
})
export class GroupListComponent implements OnInit, OnDestroy {
    groups$: Observable<Group[]>;
    isLoading$: Observable<boolean>;
    totalGroups$: Observable<number>;
    subscription: Subscription;
    username: string;
    topic: string;
    groupsPerPage = 10;
    currentPage = 1;
    loadedGroups: number;
    totalGroups: number;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private store: Store<AppState>,
        private groupService: GroupService
    ) { }

    ngOnInit() {
        this.topic =
            this.route.snapshot.queryParams['topic'][0]
                .toUpperCase() + this.route.snapshot.queryParams['topic']
                    .slice(1);

        this.username = this.authService.getUser().username;

        const start = (this.currentPage * this.groupsPerPage) - this.groupsPerPage;
        const end = (this.currentPage * this.groupsPerPage);
        this.getGroups(start, end);

        this.totalGroups$ = this.store
            .pipe(
                select(totalGroups, { topic: this.topic.toLowerCase() }),
                filter(total => !!total),
                map(v => this.totalGroups = v),
                first()
            );
        this.isLoading$ = this.store.pipe(select(isLoading));

        // Keep track of loaded groups //
        this.subscription = this.store
            .pipe(
                select(groupsAlreadyLoaded, { topic: this.topic.toLowerCase() })).
            subscribe(n => this.loadedGroups = n);
    }

    onPageChange(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.groupsPerPage = pageData.pageSize;
        const start = (this.currentPage * this.groupsPerPage) - this.groupsPerPage;
        const end = (this.currentPage * this.groupsPerPage);
        this.getGroups(start, end);
        const loadMore = ((pageData.pageIndex + 1) * pageData.pageSize > this.loadedGroups) &&
            this.totalGroups > this.loadedGroups;
        if (loadMore) {
            this.store
                .dispatch(GroupActions
                    .getTopicGroups({ topic: this.topic.toLowerCase(), pageNumber: this.currentPage, pageSize: 20 }));
        }
    }

    onJoin(id: string) {
        this.store.dispatch(UserActions.joinGroup({ groupId: id }));
        this.store.dispatch(SpinnerActions.startSpinner());
    }

    onDelete(id: string) {
        this.groupService.deleteGroup(id);
    }

    /* Get the groups needed on the page
        Provide start and end to slice the array accordingly
    */
    private getGroups(start: number, end: number) {
        return this.groups$ = this.store.pipe(select(selectTopicGroups, { topic: this.topic.toLowerCase() }))
            .pipe(
                /*
                Get groups user has joined from store
                to find out which ones he's a member of
                */
                withLatestFrom(this.store.pipe(select(selectGroupsJoined))),
                filter(([groups, joinedGroups]) => !!groups),
                map(([groups, joinedGroups]) => {
                    // Check if user has already joined the group //
                    const groupsDisplayed = [...groups]
                        .map((group: Group) => {
                            // Make excerpt for description //
                            const description = group.description
                                .split(' ').slice(0, 25).join(' ').concat('...');

                            const isMember = !!joinedGroups.find(g => g._id === group._id);

                            return {
                                ...group,
                                description,
                                isMember
                            };
                        });
                    return groupsDisplayed.slice(start, end);
                }),
            );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
