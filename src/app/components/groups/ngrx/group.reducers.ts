import { Group } from 'src/app/models/group.model';
import { on, createReducer } from '@ngrx/store';
import * as GroupActions from './group.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface GroupState extends EntityState<Group> {
    topicsLoaded: {
        topic: string,
        count: number,
        groupsLoaded: number
    }[];
}

export const adapter = createEntityAdapter<Group>();

export const initialGroupState = adapter.getInitialState({
    topicsLoaded: []
});

export const groupReducer = createReducer(
    initialGroupState,
    on(GroupActions.getTopicGroupsSuccess, (state, action) => {
        let oldTopics;
        let newTopics;
        // Check if 1st batch of groups have already been loaded //
        const oldGroupsLoaded = state.topicsLoaded.find(g => g.topic === action.topic);

        if (!oldGroupsLoaded) {
            // Add topic to group entity //
            newTopics = [...state.topicsLoaded];
            newTopics.push({
                topic: action.topic,
                count: action.count,
                groupsLoaded: action.groupsLoaded
            });
        } else {
            // Update group entity //
            const index = [...state.topicsLoaded].indexOf(oldGroupsLoaded);
            oldTopics = [...state.topicsLoaded];
            oldTopics[index] = {
                ...state.topicsLoaded[index],
                groupsLoaded: state.topicsLoaded[index].groupsLoaded + action.groupsLoaded
            };
        }
        return adapter.addMany(action.groups,
            {
                ...state,
                topicsLoaded: oldGroupsLoaded ? oldTopics : newTopics
            });
    }),
    on(GroupActions.getSingleGroupSuccess, (state, action) => {
        const newTopicLoaded = [...state.topicsLoaded];
        newTopicLoaded.push({
            topic: action.group.topic,
            count: action.count,
            groupsLoaded: 1
        });
        return adapter.addOne(action.group, {
            ...state,
            topicsLoaded: newTopicLoaded
        });
    }),
    on(GroupActions.addGroupMember, (state, action) => {
        const newMembers = state.entities[action.groupId].members + 1;

        return adapter.updateOne(
            {
                id: action.groupId,
                changes: {
                    ...state.entities[action.groupId],
                    members: newMembers
                }
            }, {
            ...state
        });
    }),
    on(GroupActions.deleteGroupMember, (state, action) => {
        const newMembers = state.entities[action.groupId].members - 1;

        return adapter.updateOne(
            {
                id: action.groupId,
                changes: {
                    ...state.entities[action.groupId],
                    members: newMembers
                }
            }, {
            ...state
        });
    }),
    on(GroupActions.createGroupEntity, (state, action) => {
        return adapter.addOne(action.group, { ...state });
    }),
    on(GroupActions.updateGroupEntity, (state, action) => {
        return adapter.updateOne(
            {
                id: action.group._id,
                changes: {
                    ...action.group
                }
            }, { ...state }
        );
    }),
    on(GroupActions.deleteGroupEntity, (state, action) => {
        return adapter.removeOne(action.groupId, { ...state });
    }),
    on(GroupActions.groupPostsLoaded, (state, action) => {
        return adapter.updateOne(
            {
                id: action.groupId,
                changes: {
                    postsLoaded: true
                }
            }, { ...state }
        );
    })
);

export const {
    selectAll,
    selectEntities,
    selectTotal,
    selectIds
} = adapter.getSelectors();
