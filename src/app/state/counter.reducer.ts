import { Action, createReducer, on } from '@ngrx/store';
import { passId, reset } from './counter.actions';
import { decrement } from './counter.actions';
import { increment } from './counter.actions';
import { initialState } from './counter.state';

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
  on(decrement, (state) => {
    return {
      ...state,
      counter: state.counter - 1,
    }
  })
  ,
  on(reset, (state) => {
    return {
      ...state,
      counter: 0,
    }
  }),
  on(passId, (state, action) => {
    console.log(action);
    console.log('_'.repeat(20))
    console.log(state);
    console.log('_'.repeat(20))
    return {
      ...state,
      counter: 0,
    }
  })
);


export function counterReducer(state: { counter: number; allVehicals: any[]; id: string; } | undefined, action: Action) {

  return _counterReducer(state, action);
}