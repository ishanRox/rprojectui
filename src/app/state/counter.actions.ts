import {createAction, props} from '@ngrx/store';

export const increment=createAction('increment');

export const passId=createAction('getId', props<{idVal:string}>() );

