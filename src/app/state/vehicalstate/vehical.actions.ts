import {createAction, props} from '@ngrx/store';

export const getVehicals=createAction('getv',props<{vehical:any}>());

