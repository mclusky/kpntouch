import { createAction } from '@ngrx/store';

export const START_SPINNER = '[UI] START_SPINNER';
export const STOP_SPINNER = '[UI] STOP_SPINNER';

export const startSpinner = createAction(
    START_SPINNER
);

export const stopSpinner = createAction(
    STOP_SPINNER
);