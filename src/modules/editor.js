import { createAction, handleActions } from 'redux-actions';
import { selectElement } from './elements';

const SET_ACTIVE_NODE = Symbol('SET_ACTIVE_NODE');
const SHOW_NODE_OUTLINE = Symbol('SHOW_NODE_OUTLINE');
const HIDE_NODE_OUTLINE = Symbol('HIDE_NODE_OUTLINE');

const initialState = {
  activeElementId: null,
  nodeOutline: {
    visible: false,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }
};

export const setActiveNode = createAction(SET_ACTIVE_NODE);
export const showNodeOutline = createAction(SHOW_NODE_OUTLINE);
export const hideNodeOutline = createAction(HIDE_NODE_OUTLINE);

export default handleActions(
  {
    [SET_ACTIVE_NODE](state, action) {
      const id = action.payload;
      if (id === state.activeElementId) {
        return state;
      }

      return {
        ...state,
        activeElementId: action.payload,
      };
    },
    [SHOW_NODE_OUTLINE](state, action) {
      return {
        ...state,
        nodeOutline: {
          visible: true,
          ...action.payload
        },
      };
    },
    [HIDE_NODE_OUTLINE](state) {
      return {
        ...state,
        nodeOutline: {
          ...state.nodeOutline,
          visible: false,
        },
      };
    },
  },
  initialState
);

export const selectEditor = state => state.editor;

export const selectActiveElementId = state => selectEditor(state).activeElementId;

export const selectActiveElement = state => {
  const element = selectElement(state, selectActiveElementId(state));
  return element !== undefined ? element : {};
};

export const selectNodeOutline = state => {
  return  selectEditor(state).nodeOutline;
};
