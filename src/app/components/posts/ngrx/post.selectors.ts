import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostState } from './post.reducer';
import * as fromPosts from './post.reducer';
import { Post } from 'src/app/models/post.model';

export const selectPostState = createFeatureSelector<PostState>('posts');

export const selectAllPosts = createSelector(
    selectPostState,
    fromPosts.selectAll
);

export const selectGroupPosts = createSelector(
    selectAllPosts,
    (posts, props) => {
        if (posts.length > 0) {
            const id = props.groupId;
            const postsInStore = posts.filter((p: Post) => p.group === id);
            return postsInStore ? postsInStore : null;
        } else {
            return null;
        }
    }
);

export const selectPostById = createSelector(
    selectAllPosts,
    (posts, props) => {
        return posts.find((p: Post) => p._id === props.postId);
    }
);

export const selectTotalPosts = createSelector(
    selectAllPosts,
    (posts, props) => {
        return posts.filter((p: Post) => p.group === props.groupId);
    }
)


