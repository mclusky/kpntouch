import { createAction, props } from '@ngrx/store';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';

export const SET_USER_GROUPS = '[LOGIN]SET_USER_GROUPS';

export const SET_USER_GROUPS_JOINED = '[LOGIN]SET_USER_GROUPS_JOINED';

export const CREATE_GROUP = '[GROUP-LIST] CREATE_GROUP';
export const CREATE_GROUP_SUCCESS = 'CREATE_GROUP_SUCCESS';
export const CREATE_GROUP_FAILED = 'CREATE_GROUP_FAILED';

export const UPDATE_GROUP = 'UPDATE_GROUP';
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS';
export const UPDATE_GROUP_FAILED = 'UPDATE_GROUP_FAILED';


export const LEAVE_GROUP = 'LEAVE_GROUP';
export const LEAVE_GROUP_SUCCESS = 'LEAVE_GROUP_SUCCESS';
export const LEAVE_GROUP_FAILED = 'LEAVE_GROUP_FAILED';

export const DELETE_GROUP = 'DELETE_GROUP';
export const DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS';
export const DELETE_GROUP_FAILED = 'DELETE_GROUP_FAILED';

export const JOIN_GROUP = '[GROUP LIST] JOIN_GROUP';
export const JOIN_GROUP_SUCCESS = 'JOIN_GROUP_SUCCESS';
export const JOIN_GROUP_FAILED = 'JOIN_GROUP_FAILED';

export const GET_USER_GROUPS = 'GET_USER_GROUPS';
export const GET_USER_GROUPS_SUCCESS = 'GET_USER_GROUPS_SUCCESS';
export const GET_USER_GROUPS_FAILED = 'GET_USER_GROUPS_FAILED';

export const setUserGroups = createAction(
    SET_USER_GROUPS,
    props<{ groups: Group[] }>()
);

export const setUserGroupsJoined = createAction(
    SET_USER_GROUPS_JOINED,
    props<{ groups: Group[] }>()
);

export const createGroup = createAction(
    CREATE_GROUP,
    props<{ group: Group }>()
);

export const createGroupSuccess = createAction(
    CREATE_GROUP_SUCCESS,
    props<{ group: Group }>()
);

export const createGroupFailed = createAction(
    CREATE_GROUP_FAILED
);

export const updateGroup = createAction(
    UPDATE_GROUP,
    props<{ group: Group }>()
);

export const updateGroupSuccess = createAction(
    UPDATE_GROUP_SUCCESS,
    props<{ group: Group }>()
);

export const updateGroupFailed = createAction(
    UPDATE_GROUP_FAILED
);

export const leaveGroup = createAction(
    LEAVE_GROUP,
    props<{ groupId: string }>()
);

export const leaveGroupSuccess = createAction(
    LEAVE_GROUP_SUCCESS,
    props<{ group: Group }>()
);

export const leaveGroupFailed = createAction(
    LEAVE_GROUP_FAILED
);

export const deleteGroup = createAction(
    DELETE_GROUP,
    props<{ groupId: string }>()
);

export const deleteGroupSuccess = createAction(
    DELETE_GROUP_SUCCESS,
    props<{ group: Group }>()
);

export const deleteGroupFailed = createAction(
    DELETE_GROUP_FAILED
);

export const joinGroup = createAction(
    JOIN_GROUP,
    props<{ groupId: string }>()
);

export const joinGroupSuccess = createAction(
    JOIN_GROUP_SUCCESS,
    props<({ group: Group })>()
);

export const joinGroupFailed = createAction(
    JOIN_GROUP_FAILED
);

export const getUserGroups = createAction(
    GET_USER_GROUPS
);

export const getUserGroupsSuccess = createAction(
    GET_USER_GROUPS_SUCCESS,
    props<{ groups: Group[] }>()
);

export const getUserGroupsFailed = createAction(
    GET_USER_GROUPS_FAILED
);