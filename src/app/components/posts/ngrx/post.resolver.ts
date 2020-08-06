import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Observable } from 'rxjs';
import { selectPostById } from './post.selectors';
import { tap, filter, first } from 'rxjs/operators';
import * as SpinnerActions from '../../../store/spinner/spinner.actions';
import * as PostActions from './post.actions';
import { Post } from 'src/app/models/post.model';

@Injectable()
export class PostResolver implements Resolve<{ post: Post }> {

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ post: Post }> {
        const postId = route.paramMap.get('postId');
        return this.store
            .pipe(
                select(selectPostById, { postId }),
                tap(post => {
                    if (!post) {
                        this.store.dispatch(SpinnerActions.startSpinner());
                        this.store.dispatch(PostActions.getSinglePost({ postId }));
                    }
                }),
                filter(post => !!post),
                first()
            );
    }
}