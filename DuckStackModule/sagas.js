import { call, put } from 'redux-saga/effects';
import { fetchSomething } from '../api/fetchSomething';
import * as t from './actiontypes';

export function* sagaTypeOne(action) {
  try {
    const value = yield call(fetchSomething, action.url);
    yield put(t.reducerTypeOne(value))
  }
  catch (value) {
    yield put(t.reducerTypeTwo(value))
  }
};