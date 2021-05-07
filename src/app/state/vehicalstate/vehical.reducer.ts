import { Action, createReducer, on } from '@ngrx/store';
import { initialState } from '../counter.state';
import { getVehicals } from './vehical.actions';



const _counterReducer = createReducer(initialState,
  on(getVehicals, (state, actions) => {

    console.trace(state);
    console.trace(actions);
    return {
      ...state,
      counter: 12312,
      allVehicals: actions.vehical

    };
  })

);




export function vehicalReducer(state: { counter: number; allVehicals: any[]; id: string } | undefined, action: Action) {

  return _counterReducer(state, action);
}