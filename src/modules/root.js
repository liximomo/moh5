import { combineReducers } from 'redux';
// import { combineEpics } from 'redux-observable';
import app from './app';
import mock from './mock';
import elements from './elements';
import editor from './editor';

// export const rootEpic = combineEpics(
//   pingEpic,
//   fetchUserEpic
// );

export const rootReducer = combineReducers({
  app,
  mock,
  elements,
  editor,
});
