import * as t from './actiontypes';

// Reducer actions.
export const reducerTypeOne = value => ({
  type: t.REDUCER_TYPE_ONE,
  value
});

export const reducerTypeTwo = value => ({
  type: t.REDUCER_TYPE_TWO,
  value
});

// Saga actions.
export const sagaTypeOne = url => ({
  type: t.SAGA_TYPE_ONE,
  url
})