// User info needed to login
export interface AuthData {
    token: string;
    token_expiration: Date;
    userId: string;
    username: string;
}
