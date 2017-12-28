import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import app from './app';
import mock from './mock';
import elements, { elementsEpic } from './elements';
import editor, { editorEpic } from './editor';

// export const rootEpic = combineEpics(
//   pingEpic,
//   fetchUserEpic
// );

export const rootEpic = combineEpics(
  editorEpic,
  elementsEpic
);

export const rootReducer = combineReducers({
  app,
  mock,
  elements,
  editor,
});
