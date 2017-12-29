import { createAction, handleActions } from 'redux-actions';
import { combineEpics } from 'redux-observable';
import { createSelector } from 'reselect';
import { selectElement, CREATE_ELEMENT } from './elements';
import { EDITOR_NODE_ATTR } from '../constants';

const ELEMENT_MOUNTED = Symbol('ELEMENT_MOUNTED');
const ACTIVATE_ELEMENT = Symbol('ACTIVATE_ELEMENT');
const SET_ELEMENT_HOVER_STATE = Symbol('SET_ELEMENT_HOVER_STATE');
const UPDATE_HOVER_ELEMENT_RECT = Symbol('UPDATE_HOVER_ELEMENT_RECT');
const UPDATE_ACTIVE_ELEMENT_RECT = Symbol('UPDATE_ACTIVE_ELEMENT_RECT');

const initialState = {
  activedElementId: null,
  hoveredElementId: null,
  activeElementRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  hoverElementRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
};

export const elementMounted = createAction(ELEMENT_MOUNTED);
export const activateELement = createAction(ACTIVATE_ELEMENT);

const updateActiveElementReact = createAction(UPDATE_ACTIVE_ELEMENT_RECT);
const updateHoverElementReact = createAction(UPDATE_HOVER_ELEMENT_RECT);

export const hoverElement = createAction(SET_ELEMENT_HOVER_STATE, ({ elementId }) => ({
  elementId,
}));

export const unHoverElement = createAction(SET_ELEMENT_HOVER_STATE, () => ({
  elementId: null,
}));


// 
// epics
//

const createElementEpic = action$ =>
  action$.ofType(CREATE_ELEMENT)
    .map(action => activateELement({
      elementId: action.payload.id
    }));

const hoveElementEpic = action$ =>
  action$
    .filter(
      action =>
        (action.type === SET_ELEMENT_HOVER_STATE) &&
        action.payload.elementId != undefined // eslint-disable-line eqeqeq
    )
    .auditTime(16)
    .map(action => {
      const elementId = action.payload.elementId;
      const node = document.querySelector(`[${EDITOR_NODE_ATTR}="${elementId}"]`);
      const react = node.getBoundingClientRect();
      return updateHoverElementReact({
        x: react.x,
        y: react.y,
        width: react.width,
        height: react.height,
      });
    });

const activeElementEpic = action$ =>
  action$
    .ofType(ELEMENT_MOUNTED)
    .withLatestFrom(
      action$
        .filter(
          action =>
            (action.type === ACTIVATE_ELEMENT) &&
            action.payload.elementId != undefined // eslint-disable-line eqeqeq
        ),
      (_, action) => action
    )
    .distinctUntilChanged()
    .map(action => {
      const elementId = action.payload.elementId;
      const node = document.querySelector(`[${EDITOR_NODE_ATTR}="${elementId}"]`);
      const react = node.getBoundingClientRect();
      return updateActiveElementReact({
        x: react.x,
        y: react.y,
        width: react.width,
        height: react.height,
      });
    })

export default handleActions(
  {
    [ACTIVATE_ELEMENT](state, action) {
      const elementId = action.payload.elementId;
      if (elementId === state.activedElementId) {
        return state;
      }

      return {
        ...state,
        activedElementId: elementId,
      };
    },
    [SET_ELEMENT_HOVER_STATE](state, action) {
      return {
        ...state,
        hoveredElementId: action.payload.elementId,
      };
    },
    [UPDATE_HOVER_ELEMENT_RECT](state, action) {
      return {
        ...state,
        hoverElementRect: {
          ...action.payload,
        },
      };
    },
    [UPDATE_ACTIVE_ELEMENT_RECT](state, action) {
      return {
        ...state,
        activeElementRect: {
          ...action.payload,
        },
      };
    },
  },
  initialState
);

export const editorEpic = combineEpics(createElementEpic, hoveElementEpic, activeElementEpic);

export const selectStage = state => state.stage;

export const selectActivedElementId = state => selectStage(state).activedElementId;
export const selectHoveredElementId = state => selectStage(state).hoveredElementId;
export const selectActiveElementRect = state => selectStage(state).activeElementRect;
export const selectHoverElementRect = state => selectStage(state).hoverElementRect;

export const selectActiveElement = state => {
  const element = selectElement(state, selectActivedElementId(state));
  return element !== undefined ? element : {};
};

export const selectElementHelper = createSelector(
  selectActivedElementId,
  selectHoveredElementId,
  selectActiveElementRect,
  selectHoverElementRect,
  (activedElementId, hoveredElementId, activeElementRect, hoverElementRect) => ({
    activedElementId,
    hoveredElementId,
    hoverElementRect,
    activeElementRect,
    isHoverElement: !!hoveredElementId,
    isActiveElement: !!activedElementId,
  })
);
