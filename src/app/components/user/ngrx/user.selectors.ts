import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducers';

export const selectUserState = createFeatureSelector<UserState>('user');
// tslint:disable: no-shadowed-variable
export const selectUserGroups = createSelector(
    selectUserState,
    state => state.userGroups
);

export const selectGroupsJoined = createSelector(
    selectUserState,
    state => state.groupsJoined
);

export const selectUserGroupById = createSelector(
    selectUserState,
    (state, props) => state.userGroups.find(g => g._id === props.id)
);

export const selectUserGroupJoinedById = createSelector(
    selectUserState,
    (state, props) => state.groupsJoined.find(g => g._id === props.id)
);

export const canSeeGroup = createSelector(
    selectUserState,
    (state, props) => {
        const id = props.id;
        const isMember = !!state.groupsJoined.find(g => g._id === id);
        const isAdmin = !!state.userGroups.find(g => g._id === id);

        return isMember || isAdmin ? true : false;
    }
);

export const canEditGroup = createSelector(
    selectUserState,
    (state, props) => state.userGroups.find(g => g._id === props.id) ? true : false
);
