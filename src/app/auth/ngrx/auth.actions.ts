import { createAction, props } from '@ngrx/store';
import { SignupData } from 'src/app/models/signup-data.model';
import { AuthData } from 'src/app/models/auth.model';


export const TRY_SIGNUP = '[HOME PAGE] TRY_SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';

export const TRY_LOGIN = '[LOGIN PAGE] TRY_LOGIN';
export const AUTH_FAILED = 'AUTH_FAILED';
export const LOGOUT = 'LOGOUT';
export const LOGIN_SUCCESS_SET_AUTH = 'LOGIN_SUCCESS_SET_AUTH';
export const CLEAR_AUTH = 'CLEAR_AUTH';

export const LOGIN_REFRESH = '[CURRENT PAGE] LOGIN_REFRESH';
export const LOGIN_REFRESH_FAILED = 'LOGIN_REFRESH_FAILED';
export const LOGIN_REFRESH_SUCCESS = 'LOGIN_REFRESH_SUCCESS';

export const RESET_PASSWORD = '[LOGIN PAGE] RESET_PASSWORD';
export const RESET_PASSWORD_ACTIVATED = '[RESET PAGE] RESET_PASSWORD_ACTIVATED';
export const SET_NEW_PASSWORD = '[RESET PAGE] SET_NEW_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED';

export const trySignup = createAction(
    TRY_SIGNUP,
    props<{ payload: SignupData }>()
);

export const signupSuccess = createAction(
    SIGNUP_SUCCESS
);

export const tryLogin = createAction(
    TRY_LOGIN,
    props<{ email: string, password: string }>()
);

export const authFailed = createAction(
    AUTH_FAILED,
    props<{ message: string }>()
);

export const logout = createAction(
    LOGOUT
);

export const setAuth = createAction(
    LOGIN_SUCCESS_SET_AUTH,
    props<{ authData: AuthData }>()
);

export const clearAuth = createAction(
    CLEAR_AUTH
);

export const loginRefresh = createAction(
    LOGIN_REFRESH
);

export const loginRefreshSuccess = createAction(
    LOGIN_REFRESH_SUCCESS,
    props<{ authData: AuthData }>()
);

export const loginRefreshFailed = createAction(
    LOGIN_REFRESH_FAILED
);

export const resetPassword = createAction(
    RESET_PASSWORD,
    props<{ email: string }>()
);

export const resetPasswordActivated = createAction(
    RESET_PASSWORD_ACTIVATED,
    props<{ resetToken: string }>()
);

export const setNewPassword = createAction(
    SET_NEW_PASSWORD,
    props<{ resetToken: string, password: string, confirmPassword: string }>()
);

export const resetPasswordSuccess = createAction(
    RESET_PASSWORD_SUCCESS
);

export const resetPasswordFailed = createAction(
    RESET_PASSWORD_FAILED
);



