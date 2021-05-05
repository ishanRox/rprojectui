import {Action, createReducer,on} from '@ngrx/store';
import { initialState } from '../counter.state';
import { getVehicals } from './vehical.actions';



const _counterReducer=createReducer(initialState,
on(getVehicals,(state)=>{
    console.log(state);
    alert('get vehicals');
return {
  ...state,
  counter:state.counter+1,
};
})

);




export function vehicalReducer(state: { counter: number; allVehicals: any[]; id:string } | undefined, action: Action) {

  return _counterReducer(state, action);
}