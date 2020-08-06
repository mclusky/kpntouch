import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Post } from 'src/app/models/post.model';
import { createReducer, on } from '@ngrx/store';
import * as PostActions from './post.actions';

export interface PostState extends EntityState<Post> {
    selectPostId: string;
}

export const selectPostId = (post: Post) => post._id;

export const adapter = createEntityAdapter<Post>({
    selectId: selectPostId
});

export const initPostsState = adapter.getInitialState();

export const postReducer = createReducer(
    initPostsState,
    on(PostActions.createPostSuccess, (state, action) => {
        return adapter.addOne(action.post, { ...state });
    }),
    on(PostActions.getGroupPostsSuccess, (state, action) => {
        return adapter.addMany(action.posts, { ...state });
    }),
    on(PostActions.getSinglePostSucess, (state, action) => {
        return adapter.addOne(action.post, { ...state });
    }),
    on(PostActions.deletePostSuccess, (state, action) => {
        return adapter.removeOne(action.postId, { ...state });
    })
);

export const {
    selectAll,
} = adapter.getSelectors();