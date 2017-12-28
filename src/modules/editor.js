import { createAction, handleActions } from 'redux-actions';
import { combineEpics } from 'redux-observable';
import { createSelector } from 'reselect';
import { selectElement } from './elements';
import { EDITOR_NODE_ATTR } from '../constants';

const ACTIVATE_ELEMENT = Symbol('ACTIVATE_ELEMENT');
const SET_HOVER_STATE = Symbol('SET_HOVER_STATE');
const UPDATE_ACTIVE_ELEMENT_RECT = Symbol('UPDATE_ACTIVE_ELEMENT_RECT');

const initialState = {
  activedElementId: null,
  hoveredElementId: null,
  isHoverElement: false,
  activeElementRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
};

export const activateELement = createAction(ACTIVATE_ELEMENT);
const updateElement = createAction(UPDATE_ACTIVE_ELEMENT_RECT);

export const hoverElement = createAction(SET_HOVER_STATE, ({ elementId }) => ({
  hover: true,
  elementId,
}));

export const unHoverElement = createAction(SET_HOVER_STATE, () => ({
  hover: false,
}));

const elementRectEpic = action$ =>
  action$
    .filter(
      action =>
        (action.type === SET_HOVER_STATE || action.type === ACTIVATE_ELEMENT) &&
        action.payload.elementId != undefined // eslint-disable-line eqeqeq
    )
    .auditTime(16) // Asynchronously wait 1000ms then continue
    .map(action => {
      const elementId = action.payload.elementId;
      return document.querySelector(`[${EDITOR_NODE_ATTR}="${elementId}"]`);
    })
    .filter(node => !!node)
    .map(node => {
      const react = node.getBoundingClientRect();
      return updateElement({
        x: react.x,
        y: react.y,
        width: react.width,
        height: react.height,
      });
    });

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
    [UPDATE_ACTIVE_ELEMENT_RECT](state, action) {
      return {
        ...state,
        activeElementRect: {
          ...action.payload,
        },
      };
    },
    [SET_HOVER_STATE](state, action) {
      return {
        ...state,
        hoveredElementId: action.payload.elementId,
        isHoverElement: action.payload.hover,
      };
    },
  },
  initialState
);

export const editorEpic = combineEpics(elementRectEpic);

export const selectEditor = state => state.editor;

export const selectActivedElementId = state => selectEditor(state).activedElementId;
export const selectHoveredElementId = state => selectEditor(state).hoveredElementId;
export const selectActiveElementRect = state => selectEditor(state).activeElementRect;
export const selectIsShowHelperOutline = state => selectEditor(state).isHoverElement;

export const selectActiveElement = state => {
  const element = selectElement(state, selectActivedElementId(state));
  return element !== undefined ? element : {};
};

export const selectElementHelper = createSelector(
  selectActivedElementId,
  selectHoveredElementId,
  selectActiveElementRect,
  selectIsShowHelperOutline,
  (activedElementId, hoveredElementId, activeElementRect, isHoverElement) => ({
    activedElementId,
    hoveredElementId,
    isHover: isHoverElement,
    ...activeElementRect,
  })
);
