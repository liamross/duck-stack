import * as t from './actiontypes';

export const defaultState = {};

export default (state = defaultState) => {
  switch (action.type) {
    case t.REDUCER_TYPE_ONE:
      // do something with action.value
      return state;
    case t.REDUCER_TYPE_TWO:
      // do something with action.value
      return state;
    default:
      return state;
  }
};