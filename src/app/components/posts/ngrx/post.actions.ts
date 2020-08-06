import { Post } from 'src/app/models/post.model';
import { createAction, props } from '@ngrx/store';
import { GET_SINGLE_GROUP_FAILED } from '../../groups/ngrx/group.actions';
import { Action } from 'rxjs/internal/scheduler/Action';

export const GET_GROUP_POSTS = '[GROUP PAGE] GET_GROUP_POSTS';
export const GET_GROUP_POSTS_SUCCESS = 'GET_GROUP_POSTS_SUCCESS';
export const GET_GROUP_POSTS_FAILED = 'GET_GROUP_POSTS_FAILED';

export const GET_SINGLE_POST = '[CREATE PAGE] GET_SINGLE_POST';
export const GET_SINGLE_POST_SUCCESS = 'GET_SINGLE_POST_SUCCESS';
export const GET_SINGLE_POST_FAILED = 'GET_SINGLE_POST_FAILED';

export const CREATE_POST = '[CREATE POST PAGE] CREATE_POST';
export const CREATE_POST_SUCCESS = '[CREATE POST PAGE] CREATE_POST_SUCCESS';
export const CREATE_POST_FAILED = '[CREATE POST PAGE] CREATE_POST_FAILED';

export const UPDATE_POST = '[CREATE PAGE] UPDATE_POST';
export const UPDATE_POST_SUCCESS = '[CREATE PAGE] UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILED = '[CREATE PAGE] UPDATE_POST_FAILED';

export const DELETE_POST = 'DELETE_POST';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_FAILED = 'DELETE_POST_FAILED';

export const getGroupPosts = createAction(
    GET_GROUP_POSTS,
    props<{ groupId: string, pageNumber: number, pageSize: number }>()
);

export const getGroupPostsSuccess = createAction(
    GET_GROUP_POSTS_SUCCESS,
    props<{ posts: Post[] }>()
);

export const getGroupPostsFailed = createAction(
    GET_GROUP_POSTS_FAILED
);

export const getSinglePost = createAction(
    GET_SINGLE_POST,
    props<{ postId: string }>()
);

export const getSinglePostSucess = createAction(
    GET_SINGLE_POST_SUCCESS,
    props<{ post: Post }>()
);

export const getSinglePostFailed = createAction(
    GET_SINGLE_POST_FAILED
);

export const createPost = createAction(
    CREATE_POST,
    props<{ post: FormData }>()
);

export const createPostSuccess = createAction(
    CREATE_POST_SUCCESS,
    props<{ post: Post }>()
);

export const createPostFailed = createAction(
    CREATE_POST_FAILED
);

export const updatePost = createAction(
    UPDATE_POST,
    props<{ post: Post }>()
);

export const updatePostSuccess = createAction(
    UPDATE_POST_SUCCESS,
    props<{ post: Post }>()
);

export const updatePostFailed = createAction(
    UPDATE_POST_FAILED
);

export const deletePost = createAction(
    DELETE_POST,
    props<{ postId: string }>()
);

export const deletePostSuccess = createAction(
    DELETE_POST_SUCCESS,
    props<{ postId: string }>()
);

export const deletePostFailed = createAction(
    DELETE_POST_FAILED
);
