import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import app from './app';
import mock from './mock';
import elements from './elements';
import stage, { editorEpic } from './stage';

// export const rootEpic = combineEpics(
//   pingEpic,
//   fetchUserEpic
// );

export const rootEpic = combineEpics(
  editorEpic,
);

export const rootReducer = combineReducers({
  app,
  mock,
  elements,
  stage,
});
