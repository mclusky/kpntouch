import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Group } from 'src/app/models/group.model';
import { selectGroupById } from '../ngrx/group.selectors';
import { GroupService } from 'src/app/services/group.service';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.sass']
})
export class GroupComponent implements OnInit {
    user: string;
    group$: Observable<Group>;
    groupId: string;
    isAdmin: boolean;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private groupService: GroupService
    ) { }

    ngOnInit() {
        this.user = this.authService.getUser().username;
        this.groupId = this.route.snapshot.params['groupId'];
        this.group$ = this.store
            .pipe(
                select(selectGroupById, { id: this.groupId }),
                map((group: Group) => {
                    this.isAdmin = group.admin === this.user ? true : false;
                    return group;
                }));
    }

    onLeave() {
        if (this.isAdmin) {
            return this.groupService.deleteGroup(this.groupId);
        }
        this.groupService.leaveGroup(this.groupId);
    }

}
