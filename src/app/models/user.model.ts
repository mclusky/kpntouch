import { Group } from './group.model';

// User info to use in front end //
export interface User {
    userGroups: Group[];
    groupsJoined: Group[];
}
