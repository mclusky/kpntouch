import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Group } from 'src/app/models/group.model';
import { selectUserGroups, selectGroupsJoined } from '../../user/ngrx/user.selectors';
import { AuthData } from 'src/app/models/auth.model';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { PageEvent } from '@angular/material/paginator';
import { isLoading } from 'src/app/store/spinner/spinner.selectors';

@Component({
    selector: 'app-user-groups',
    templateUrl: './user-groups.component.html',
    styleUrls: ['./user-groups.component.sass']
})
export class UserGroupsComponent implements OnInit, OnDestroy {
    groups$: Observable<Group[]>;
    totalGroups$: Observable<number>;
    user: AuthData;
    isLoading$: Observable<boolean>;
    subscirption: Subscription;
    groupCategory: string;
    groupsPerPage = 5;
    currentPage = 1;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private groupService: GroupService
    ) { }

    ngOnInit() {
        this.isLoading$ = this.store.pipe(select(isLoading));
        this.user = this.authService.getUser();
        const start = (this.currentPage * this.groupsPerPage) - this.groupsPerPage;
        const end = (this.currentPage * this.groupsPerPage);
        this.subscirption = this.route.queryParams
            .pipe(
                map(val => {
                    this.groupCategory = val.category;
                    if (val.category === 'created') {
                        this.groupCategory = 'created';
                        this.getUserGroups(start, end);

                        this.totalGroups$ = this.store.pipe(select(selectUserGroups))
                            .pipe(
                                map(groups => groups.length)
                            );
                    } else if (val.category === 'joined') {
                        this.groupCategory = 'joined';
                        this.getGroupsJoined(start, end);

                        this.totalGroups$ = this.store.pipe(select(selectGroupsJoined))
                            .pipe(
                                map(groups => groups.length)
                            );
                    }
                }
                ))
            .subscribe();
    }

    onPageChange(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.groupsPerPage = pageData.pageSize;
        const start = (this.currentPage * this.groupsPerPage) - this.groupsPerPage;
        const end = (this.currentPage * this.groupsPerPage);

        this.groupCategory === 'joined' ?
            this.getGroupsJoined(start, end) : this.getUserGroups(start, end);
    }

    onDelete(id: string) {
        this.groupService.deleteGroup(id);
    }

    private getGroupsJoined(start: number, end: number) {
        return this.groups$ = this.store.pipe(select(selectGroupsJoined))
            .pipe(
                map(groups => {
                    const groupsDisplayed = [...groups]
                        .map((group: Group) => {
                            // Make excerpt for long description //
                            return group.description.length > 25 ? this.makeExcerpt(group) : group;
                        });
                    return groupsDisplayed.slice(start, end);
                })
            );
    }

    private getUserGroups(start: number, end: number) {
        this.groups$ = this.store.pipe(select(selectUserGroups))
            .pipe(
                map(groups => {
                    const groupsDisplayed = [...groups]
                        .map((group: Group) => {
                            // Make excerpt for long description //
                            return group.description.length > 25 ? this.makeExcerpt(group) : group;
                        });
                    return groupsDisplayed.slice(start, end);
                })
            );
    }

    private makeExcerpt(group: Group) {
        const description = group.description
            .split(' ').slice(0, 25).join(' ').concat('...');
        return {
            ...group,
            description
        };
    }

    ngOnDestroy() {
        this.subscirption.unsubscribe();
    }

}
