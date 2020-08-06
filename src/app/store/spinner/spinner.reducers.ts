import { createReducer, on } from '@ngrx/store';
import * as SpinnerActions from './spinner.actions';

export interface SpinnerState {
    loading: boolean;
}

export const initialSpinnerState: SpinnerState = {
    loading: false
};

export const spinnerReducer = createReducer(
    initialSpinnerState,
    on(SpinnerActions.startSpinner, (state, action) => {
        return {
            ...state,
            loading: true
        };
    }),
    on(SpinnerActions.stopSpinner, (state, action) => {
        return {
            ...state,
            loading: false
        };
    })
);
