import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
    userId: string;
    username: string;
    token: string;
    token_expiration: Date;
    loading: boolean;
    resetToken?: string;
}

export const initialAuthState: AuthState = {
    userId: undefined,
    username: undefined,
    token: undefined,
    token_expiration: undefined,
    loading: false,
};

export const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.tryLogin, (state, action) => {
        return {
            ...state,
            loading: true,
        };
    }),
    on(AuthActions.trySignup, (state, action) => {
        return {
            ...state,
            loading: true
        };
    }),
    on(AuthActions.signupSuccess, (state, action) => {
        return {
            ...state,
            loading: false
        };
    }),
    on(AuthActions.setAuth, (state, action) => {
        return {
            ...state,
            token: action.authData.token,
            token_expiration: action.authData.token_expiration,
            userId: action.authData.userId,
            username: action.authData.username,
            loading: false
        };
    }),
    on(AuthActions.logout, (state, action) => {
        return {
            ...state,
        };
    }),
    on(AuthActions.clearAuth, (state, action) => {
        return {
            ...state,
            token: undefined,
            token_expiration: undefined,
            userId: undefined,
            username: undefined
        };
    }),
    on(AuthActions.authFailed, (state, action) => {
        return {
            ...state,
            loading: false
        };
    }),
    on(AuthActions.loginRefreshSuccess, (state, action) => {
        return {
            ...state,
            token: action.authData.token,
            token_expiration: action.authData.token_expiration,
            userId: action.authData.userId,
            username: action.authData.username
        };
    }),
    on(AuthActions.resetPasswordActivated, (state, action) => {
        return {
            ...state,
            resetToken: action.resetToken
        }
    })
);

