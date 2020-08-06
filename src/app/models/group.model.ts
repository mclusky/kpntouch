export interface Group {
    _id: string;
    topic: string;
    name: string;
    description: string;
    createdAt?: Date;
    admin: string;
    swearingAllowed: boolean;
    members?: number;
    isMember?: boolean;
    postsLoaded: boolean;
}
