import { createAction, props } from '@ngrx/store';
import { Group } from 'src/app/models/group.model';

export const GET_TOPIC_GROUPS = '[HOME] GET_TOPIC_GROUPS';
export const GET_TOPIC_GROUPS_SUCCESS = 'GET_TOPIC_GROUPS_SUCCESS';
export const GET_TOPIC_GROUPS_FAILED = ' GET_TOPIC_GROUPS_FAILED';

export const ADD_GROUP_MEMBER = '[GROUP LIST] ADD_GROUP_MEMBER';
export const DELETE_GROUP_MEMBER = '[GROUP PAGE] DELETE_GROUP_MEMBER';

export const GET_SINGLE_GROUP = 'GET_SINGLE_GROUP';
export const GET_SINGLE_GROUP_SUCCESS = 'GET_SINGLE_GROUP_SUCCESS';
export const GET_SINGLE_GROUP_FAILED = 'GET_SINGLE_GROUP_FAILED';

export const GROUP_POSTS_LOADED = 'GROUPS_POSTS_LOADED';

export const CREATE_GROUP_ENTITY = '[CREATE GROUP PAGE] CREATE_GROUP_ENTITY';

export const UPDATE_GROUP_ENTITY = '[USER GROUP] UPDATE_GROUP_ENTITY';

export const DELETE_GROUP_ENTITY = 'DELETE_GROUP_ENTITY';


export const getTopicGroups = createAction(
    GET_TOPIC_GROUPS,
    props<{ topic: string, pageNumber: number, pageSize: number }>()
);

export const getTopicGroupsSuccess = createAction(
    GET_TOPIC_GROUPS_SUCCESS,
    props<{ groups: Group[], topic: string, count: number, groupsLoaded: number }>()
);

export const getTopicGroupsFailed = createAction(
    GET_TOPIC_GROUPS_FAILED
);

export const addGroupMember = createAction(
    ADD_GROUP_MEMBER,
    props<{ groupId: string }>()
);

export const deleteGroupMember = createAction(
    DELETE_GROUP_MEMBER,
    props<{ groupId: string }>()
);

export const getSingleGroup = createAction(
    GET_SINGLE_GROUP,
    props<{ groupId: string }>()
);

export const getSingleGroupSuccess = createAction(
    GET_SINGLE_GROUP_SUCCESS,
    props<{ group: Group, count: number }>()
);

export const getSingleGroupFailed = createAction(
    GET_SINGLE_GROUP_FAILED
);

export const groupPostsLoaded = createAction(
    GROUP_POSTS_LOADED,
    props<{ groupId: string }>()
);

export const createGroupEntity = createAction(
    CREATE_GROUP_ENTITY,
    props<{ group: Group }>()
);

export const updateGroupEntity = createAction(
    UPDATE_GROUP_ENTITY,
    props<{ group: Group }>()
);

export const deleteGroupEntity = createAction(
    DELETE_GROUP_ENTITY,
    props<{ groupId: string }>()
);
