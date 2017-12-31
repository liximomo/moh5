import { createAction, handleActions } from 'redux-actions';
import { combineEpics } from 'redux-observable';
import { createSelector } from 'reselect';
import { selectElement, CREATE_ELEMENT } from './elements';
import { EDITOR_NODE_ATTR } from '../constants';

const ELEMENT_MOUNTED = Symbol('ELEMENT_MOUNTED');
const SET_ELEMENT_ACTIVE_STATE = Symbol('SET_ELEMENT_ACTIVE_STATE');
const ACTIVATE_ELEMENT_WHEN_MOUNTED = Symbol('ACTIVATE_ELEMENT_WHEN_MOUNTED');
const SET_ELEMENT_HOVER_STATE = Symbol('SET_ELEMENT_HOVER_STATE');
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

const updateActiveElementReact = createAction(UPDATE_ACTIVE_ELEMENT_RECT);

export const elementMounted = createAction(ELEMENT_MOUNTED);
export const activateELement = createAction(SET_ELEMENT_ACTIVE_STATE, ({ elementId }) => {
  const node = document.querySelector(`[${EDITOR_NODE_ATTR}="${elementId}"]`);
  const react = node.getBoundingClientRect();
  return {
    elementId,
    elementRect: {
      x: react.x,
      y: react.y,
      width: react.width,
      height: react.height,
    },
  };
});
export const clearActivedELement = createAction(SET_ELEMENT_ACTIVE_STATE, () => ({
  elementId: null,
}));

export const activateELementWhenMounted = createAction(ACTIVATE_ELEMENT_WHEN_MOUNTED);

export const hoverElement = createAction(SET_ELEMENT_HOVER_STATE, ({ elementId }) => {
  const node = document.querySelector(`[${EDITOR_NODE_ATTR}="${elementId}"]`);
  const react = node.getBoundingClientRect();
  return {
    elementId,
    elementRect: {
      x: react.x,
      y: react.y,
      width: react.width,
      height: react.height,
    },
  };
});

export const unHoverElement = createAction(SET_ELEMENT_HOVER_STATE, () => ({
  elementId: null,
}));


//
// epics
//

const createElementEpic = action$ =>
  action$.ofType(CREATE_ELEMENT).map(action =>
    activateELementWhenMounted({
      elementId: action.payload.id,
    })
  );

const activeElementEpic = action$ =>
  action$
    .ofType(ELEMENT_MOUNTED)
    .withLatestFrom(
      action$.ofType(ACTIVATE_ELEMENT_WHEN_MOUNTED),
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
    });

export default handleActions(
  {
    [SET_ELEMENT_ACTIVE_STATE](state, action) {
      const {
        elementId,
        elementRect
      } = action.payload;
      if (elementId === state.activedElementId) {
        return state;
      }

      const next = {
        ...state,
        activedElementId: elementId,
      };

      if (elementRect) {
        next.activeElementRect = elementRect;
      }

      return next;
    },
    [ACTIVATE_ELEMENT_WHEN_MOUNTED](state, action) {
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
      const {
        elementId,
        elementRect
      } = action.payload;
      if (elementId === state.hoveredElementId) {
        return state;
      }
  
      const next = {
        ...state,
        hoveredElementId: elementId,
      };

      if (elementRect) {
        next.hoverElementRect = elementRect;
      }

      return next;
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

export const editorEpic = combineEpics(
  createElementEpic,
  activeElementEpic,
);

export const selectStage = state => state.stage;

export const selectActivedElementId = state => selectStage(state).activedElementId;
export const selectHoveredElementId = state => selectStage(state).hoveredElementId;
export const selectActiveElementRect = state => selectStage(state).activeElementRect;
export const selectHoverElementRect = state => selectStage(state).hoverElementRect;

export const selectActiveElement = state => {
  const element = selectElement(state, selectActivedElementId(state));
  return element !== undefined ? element : {};
};

export const selectHelperOutline = createSelector(
  selectActivedElementId,
  selectHoveredElementId,
  selectHoverElementRect,
  (activedElementId, hoveredElementId, hoverElementRect) => ({
    ...hoverElementRect,
    isHoverElement: Boolean(hoveredElementId) && activedElementId !== hoveredElementId,
  })
);

export const selectHelperResizer = createSelector(
  selectActivedElementId,
  selectActiveElementRect,
  (activedElementId, activeElementRect) => ({
    ...activeElementRect,
    isActiveElement: Boolean(activedElementId),
  })
);
