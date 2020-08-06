import * as fromAuth from '../auth/ngrx/auth.reducers';
import * as fromGroups from '../components/groups/ngrx/group.reducers';
import * as fromSpinner from './spinner/spinner.reducers';
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { environment } from 'src/environments/environment';

export interface AppState {
    auth: fromAuth.AuthState;
    groups: fromGroups.GroupState;
    router: any;
    spinner: fromSpinner.SpinnerState;
}

export const appReducers: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    groups: fromGroups.groupReducer,
    router: routerReducer,
    spinner: fromSpinner.spinnerReducer
};


export function logger(reducer: ActionReducer<any>)
    : ActionReducer<any> {
    return (state, action) => {
        console.log("state before: ", state);
        console.log("action", action);

        return reducer(state, action);
    }

}


export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger] : [];