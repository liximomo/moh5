import { createStore, applyMiddleware, compose } from 'redux';
// import { createEpicMiddleware } from 'redux-observable';
import reduxThunk from 'redux-thunk';
import { rootReducer } from './root';

const isDev = process.env.NODE_ENV === 'development';

// const epicMiddleware = createEpicMiddleware(rootEpic);

const tryGetReduxDevTool = () => {
  return typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        serialize: true,
      })
    : compose;
};
const composeEnhancers = isDev ? tryGetReduxDevTool() : compose;

const enhancer = composeEnhancers(
  // Middlewar
  applyMiddleware(reduxThunk)
  // applyMiddleware(epicMiddleware),
);

export function configStore(rootReducer, initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  return store;
}

const store = configStore(rootReducer, undefined);

if (isDev) {
  window.store = store;
}

export default store;
