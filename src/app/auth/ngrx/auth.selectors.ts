import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const isLoggedIn = createSelector(
    selectAuthState,
    auth => !!auth.token
);

export const loading = createSelector(
    selectAuthState,
    auth => auth.loading
);

export const isResetToken = createSelector(
    selectAuthState,
    auth => auth.resetToken
);

