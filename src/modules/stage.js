import { createAction, handleActions } from 'redux-actions';
import { combineEpics } from 'redux-observable';
import { createSelector } from 'reselect';
import { selectElement, CREATE_ELEMENT } from './elements';
import { EDITOR_DOM_ATTR, STAGE_DOM_CLASS } from '../constants';

const EVENT_STAGE_RESIZE = Symbol('EVENT_STAGE_RESIZE');

const UPDATE_STAGE_RECT = Symbol('SET_STAGE_RECT');
const UPDATE_STAGE = Symbol('UPDATE_STAGE');
const ELEMENT_MOUNTED = Symbol('ELEMENT_MOUNTED');
const SET_ELEMENT_ACTIVE_STATE = Symbol('SET_ELEMENT_ACTIVE_STATE');
const ACTIVATE_ELEMENT_WHEN_MOUNTED = Symbol('ACTIVATE_ELEMENT_WHEN_MOUNTED');
const SET_ELEMENT_HOVER_STATE = Symbol('SET_ELEMENT_HOVER_STATE');

const initialState = {
  activedElementId: null,
  hoveredElementId: null,
  rect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
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

export const emitStageResize = createAction(EVENT_STAGE_RESIZE);
export const updateStage = createAction(UPDATE_STAGE);

export const updateStateRect = (rect) => updateStage({
  rect,
});
const updateActiveElementRect = (rect) => updateStage({
  activeElementRect: rect,
});

export const elementMounted = createAction(ELEMENT_MOUNTED);
export const activateELement = createAction(SET_ELEMENT_ACTIVE_STATE, ({ elementId }) => {
  const node = document.querySelector(`[${EDITOR_DOM_ATTR}="${elementId}"]`);
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
  const node = document.querySelector(`[${EDITOR_DOM_ATTR}="${elementId}"]`);
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
      const node = document.querySelector(`[${EDITOR_DOM_ATTR}="${elementId}"]`);
      const react = node.getBoundingClientRect();
      return updateActiveElementRect({
        x: react.x,
        y: react.y,
        width: react.width,
        height: react.height,
      });
    });

const stageResize = (action$, store) => {
  return action$
    .ofType(EVENT_STAGE_RESIZE)
    .map(_ => {
      const payload = {};
      const state = store.getState();
      const acitveElementId = selectActivedElementId(state);
      const hoverElementId = selectHoveredElementId(state);
      if (acitveElementId) {
        const node = document.querySelector(`[${EDITOR_DOM_ATTR}="${acitveElementId}"]`);
        payload.activeElementRect = node.getBoundingClientRect();
      } else if (hoverElementId) {
        const node = document.querySelector(`[${EDITOR_DOM_ATTR}="${hoverElementId}"]`);
        payload.hoverElementRect = node.getBoundingClientRect();
      }

      const node = document.querySelector(`.${STAGE_DOM_CLASS}`);
      payload.rect = node.getBoundingClientRect();
      return updateStage(payload);
    });
}
  

export default handleActions(
  { 
    [UPDATE_STAGE_RECT](state, action) {
      return {
        ...state,
        rect: {
          ...action.payload,
        },
      };
    },
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
        hoveredElementId: null,
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
    [UPDATE_STAGE](state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  initialState
);

export const editorEpic = combineEpics(
  createElementEpic,
  activeElementEpic,
  stageResize,
);

export const selectStage = state => state.stage;

export const selectStageRect = state => selectStage(state).rect;
export const selectActivedElementId = state => selectStage(state).activedElementId;
export const selectHoveredElementId = state => selectStage(state).hoveredElementId;
export const selectActiveElementRect = state => selectStage(state).activeElementRect;
export const selectHoverElementRect = state => selectStage(state).hoverElementRect;

export const selectActiveElement = state => {
  const element = selectElement(state, selectActivedElementId(state));
  return element !== undefined ? element : {};
};

export const selectHelperOutline = createSelector(
  selectStageRect,
  selectActivedElementId,
  selectHoveredElementId,
  selectHoverElementRect,
  (stageRect, activedElementId, hoveredElementId, hoverElementRect) => ({
    x: hoverElementRect.x - stageRect.x,
    y: hoverElementRect.y - stageRect.y,
    width: hoverElementRect.width,
    height: hoverElementRect.height,
    isHoverElement: Boolean(hoveredElementId) && activedElementId !== hoveredElementId,
  })
);

export const selectHelperResizer = createSelector(
  selectStageRect,
  selectActivedElementId,
  selectActiveElementRect,
  (stageRect, activedElementId, activeElementRect) => ({
    x: activeElementRect.x - stageRect.x,
    y: activeElementRect.y - stageRect.y,
    width: activeElementRect.width,
    height: activeElementRect.height,
    isActiveElement: Boolean(activedElementId),
  })
);
