import { createAction, handleActions } from 'redux-actions';
import { selectElement } from './elements';

const SET_ACTIVE_NODE = Symbol('SET_ACTIVE_NODE');

const initialState = {
  activeElementId: null,
};

export const setActiveNode = createAction(SET_ACTIVE_NODE);

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
  },
  initialState
);

export const selectEditor = state => state.editor;

export const selectActiveElementId = state => selectEditor(state).activeElementId;

export const selectActiveElement = state => {
  const element = selectElement(state, selectActiveElementId(state));
  return element !== undefined ? element : {};
};
