import { Action, createReducer, on } from '@ngrx/store';
import { passId } from './main.actions';

import { increment } from './main.actions';
import { initialState } from './main.state';

const _counterReducer = createReducer(initialState,
  on(increment, (state) => {
    alert(state.counter);
    alert(state.allVehicals[0])
    alert('incremented');

    return {
      ...state,
      counter: state.counter + 1,
      allVehicals: []
    };
  })
 ,
  on(passId, (state, action) => {
    console.log(action.idVal);
    console.log('_'.repeat(20))
    console.log(state);
    console.log('_'.repeat(20))
    return {
      ...state,
      id:action.idVal
    }
  })

);


export function mainReducer(state: { counter: number; allVehicals: any[]; id: string; } | undefined, action: Action) {

  return _counterReducer(state, action);
}