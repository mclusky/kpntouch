import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { User } from 'src/app/models/user.model';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';

import * as UserActions from './user.actions';
import { on, createReducer } from '@ngrx/store';


export interface UserState extends EntityState<User> {
    userGroups: Group[];
    groupsJoined: Group[];
    userPosts: Post[];
}

export const adapter = createEntityAdapter<User>();

export const initialUserState = adapter.getInitialState({
    userGroups: [],
    groupsJoined: [],
    userPosts: []
});
// tslint:disable: no-shadowed-variable
export const userReducer = createReducer(
    initialUserState,
    on(UserActions.setUserGroups, (state, action) => {
        return {
            ...state,
            userGroups: action.groups
        }
    }),
    on(UserActions.setUserGroupsJoined, (state, action) => {
        return {
            ...state,
            groupsJoined: action.groups
        }
    }),
    on(UserActions.joinGroupSuccess, (state, action) => {
        const newGroupsJoined = [...state.groupsJoined];
        newGroupsJoined.push(action.group);
        return {
            ...state,
            groupsJoined: newGroupsJoined
        };
    }),
    on(UserActions.createGroupSuccess, (state, action) => {
        const newUserGroups = [...state.userGroups];
        newUserGroups.push(action.group);
        return {
            ...state,
            userGroups: newUserGroups
        };
    }),
    on(UserActions.updateGroupSuccess, (state, action) => {
        const newUserGroups = [...state.userGroups].map((g: Group) => g._id === action.group._id ? { ...action.group } : g);
        return {
            ...state,
            userGroups: newUserGroups
        };
    }),
    on(UserActions.leaveGroupSuccess, (state, action) => {
        const newGroupsJoined = [...state.groupsJoined]
            .filter((g: Group) => g._id !== action.group._id);
        return {
            ...state,
            groupsJoined: newGroupsJoined
        };
    }),
    on(UserActions.deleteGroupSuccess, (state, action) => {
        const newUserGroups = [...state.userGroups]
            .filter((g: Group) => g._id !== action.group._id);
        return {
            ...state,
            userGroups: newUserGroups
        };
    }),
);
