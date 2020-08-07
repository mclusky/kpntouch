import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { AppState } from 'src/app/store/app.reducers';

import * as PostActions from '../ngrx/post.actions';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';

import { Post } from 'src/app/models/post.model';
import { selectGroupPosts } from '../ngrx/post.selectors';
import { AuthService } from 'src/app/services/auth.service';
import { CheckComponent } from 'src/app/dialogs/check/check.component';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.sass']
})
export class PostListComponent implements OnInit {
    @Input() groupId: string;

    posts$: Observable<Post[]>;
    isLoading$: Observable<boolean>;
    totalPosts$: Observable<boolean>;
    postsPerPage = 5;
    pageOptions = [1, 2, 5, 10];
    currentPage = 1;
    userId: string;

    @ViewChild('paginator', { static: false }) paginator;

    constructor(
        private store: Store<AppState>,
        private authService: AuthService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.userId = this.authService.getUser().userId;
        this.store
            .dispatch(PostActions.getGroupPosts({ groupId: this.groupId, pageNumber: this.currentPage, pageSize: this.postsPerPage }));
        this.posts$ = this.store
            .pipe(
                select(selectGroupPosts, { groupId: this.groupId }),
                map(posts => posts)
            );
    }

    onPageChange(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
    }

    onDelete(id: string) {
        const username = this.authService.getUser().username;
        const dialogRef = this.dialog.open(CheckComponent, { data: { user: username, message: 'Delete this post', action: 'Delete' } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(PostActions.deletePost({ postId: id }));
                this.store.dispatch(SpinnerActions.startSpinner());
            }
        });
    }

}
