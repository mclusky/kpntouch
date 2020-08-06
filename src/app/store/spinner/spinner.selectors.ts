import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpinnerState } from './spinner.reducers';

export const selectSpinnerState = createFeatureSelector<SpinnerState>('spinner');

export const isLoading = createSelector(
    selectSpinnerState,
    state => state.loading
);
