import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupState } from './group.reducers';
import * as fromGroups from './group.reducers';
import { Group } from 'src/app/models/group.model';

export const selectGroupsState = createFeatureSelector<GroupState>('groups');

export const selectAllGroups = createSelector(
    selectGroupsState,
    fromGroups.selectAll
);

export const selectTopicGroups = createSelector(
    selectAllGroups,
    (groups, props) => {
        const topic = props.topic;
        return groups.filter(g => g.topic === topic);
    }
);

export const isTopicLoaded = createSelector(
    selectGroupsState,
    (state, props) => {
        const topic = props.topic;
        const group = state.topicsLoaded.find(g => g.topic === topic);
        if (!group) {
            return false;
        } else if (group.count <= 20 && group.groupsLoaded < group.count) {
            return false;
        } else if (group.count >= 20 && group.groupsLoaded < 20) {
            return false;
        }
        return true;
    }
);

export const selectGroupById = createSelector(
    selectAllGroups,
    (groups, props) => {
        const id = props.id;
        return groups.find(g => g._id === id);
    }
);

export const totalGroups = createSelector(
    selectGroupsState,
    (state, props) => {
        const topic = props.topic;
        const group = state.topicsLoaded.find(g => g.topic === topic);
        return group ? group.count : 0;
    }
);

export const groupsAlreadyLoaded = createSelector(
    selectGroupsState,
    (state, props) => {
        const topic = props.topic;
        const group = state.topicsLoaded.find(g => g.topic === topic);
        return group ? group.groupsLoaded : 0;
    }
);

export const areGroupPostsLoaded = createSelector(
    selectAllGroups,
    (groups, props) => {
        const id = props.id;
        const group: Group = groups.find((g: Group) => g._id === id);
        return group.postsLoaded;
    }
);

