import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { DEVICE_MAP, INIT_DEVICE } from '../constants';
import normalizeNode from '../utils/normalizeNode';
import * as MO from '../mo';

const ADD_CHILD = Symbol('ADD_CHILD');
const MOVE_CHILD = Symbol('MOVE_CHILD');
const REMOVE_CHILD = Symbol('REMOVE_CHILD');
const CREATE_ELEMENT = Symbol('CREATE_ELEMENT');
const DELETE_ELEMENT = Symbol('DELETE_ELEMENT');
const UPDATE_ELEMENT = Symbol('UPDATE_ELEMENT');

// 页面根布局
const artboard = MO.createArtborad({
  width: DEVICE_MAP[INIT_DEVICE].width,
  height: DEVICE_MAP[INIT_DEVICE].height,
});

export const createElement = createAction(CREATE_ELEMENT, (type, props = {}, childIds = []) => {
  const node = MO.createElement(type, props);
  node.childIds = childIds;
  delete node.children;
  return node;
});

export const deleteElement = createAction(DELETE_ELEMENT);

export const updateElement = createAction(UPDATE_ELEMENT, (id, props) => ({
  id,
  props,
}));

export const addChild = createAction(ADD_CHILD, (id, childId) => ({ id, childId }));

/**
 * 改变自己 child 的顺序
 */
export const moveChild = createAction(MOVE_CHILD, (id, childId, toIndex) => ({
  id,
  childId,
  toIndex,
}));

export const insertChildBeforeIndex = createAction(ADD_CHILD, (id, childId, beforeIndex) => ({
  id,
  childId,
  beforeIndex,
}));

export const removeChild = createAction(REMOVE_CHILD, (id, childId) => ({ id, childId }));

/**
 * 创建node, 并将其设为指定 node 的 child.
 * @param {*} id 父节点
 * @param {*} type 类型
 * @param {*} props 属性
 */
export const createElementAt = (id, type, props = {}) => dispatch => {
  const action = dispatch(createElement(type, props));
  return dispatch(addChild(id, action.payload.id));
};

export const moveChildToAnotherBeforeIndex = (id, childId, toId, beforeIndex) => dispatch => {
  if (id === toId) {
    return dispatch(moveChild(id, childId, beforeIndex));
  }

  dispatch(removeChild(id, childId));
  return dispatch(insertChildBeforeIndex(toId, childId, beforeIndex));
};

/**
 * 创建node, 并将其添加到画板上.
 * @param {*} id 父节点
 * @param {*} type 类型
 * @param {*} props 属性
 */
export const createElementAtArtBorad = createElementAt.bind(null, artboard.id);

const childIds = handleActions(
  {
    [ADD_CHILD]: (state, action) => {
      const copy = [...state];
      const { childId, beforeIndex } = action.payload;

      if (beforeIndex === undefined) {
        copy.push(action.payload.childId);
      } else {
        copy.splice(beforeIndex, 0, childId);
      }

      return copy;
    },
    [REMOVE_CHILD]: (state, action) => {
      const copy = [...state];
      const { childId } = action.payload;

      const index = copy.findIndex(id => id === childId);
      copy.splice(index, 1);
      return copy;
    },
    [MOVE_CHILD]: (state, action) => {
      const { childId, toIndex } = action.payload;

      if (toIndex === undefined) {
        return state;
      }

      let targetIndex = Math.min(toIndex, state.length);
      const srcIndex = state.findIndex(id => id === childId);
      if (srcIndex === -1 || srcIndex === targetIndex) {
        return state;
      }

      const next = state.slice(0, srcIndex).concat(state.slice(srcIndex + 1, state.length));

      if (targetIndex < 0) {
        next.unshift(childId);
      } else if (targetIndex >= state.length) {
        next.push(childId);
      } else {
        if (srcIndex > targetIndex) {
          next.splice(targetIndex, 0, childId);
        } else {
          next.splice(targetIndex - 1, 0, childId);
        }
      }

      return next;
    },
  },
  []
);

const node = handleActions(
  {
    [CREATE_ELEMENT](state, action) {
      return action.payload;
    },
    [UPDATE_ELEMENT](state, action) {
      const { props } = action.payload;
      return {
        ...state,
        ...props,
      };
    },
    [combineActions(ADD_CHILD, REMOVE_CHILD, MOVE_CHILD)]: (state, action) => {
      return {
        ...state,
        childIds: childIds(state.childIds, action),
      };
    },
  },
  {}
);

const getAllDescendantIds = (state, id) =>
  state[id].childIds.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(state, childId)],
    []
  );

const deleteMany = (state, ids) => {
  const stateCopy = { ...state };
  ids.forEach(id => delete stateCopy[id]);
  return stateCopy;
};

export const initialState = normalizeNode(artboard);

export default handleActions(
  {
    [DELETE_ELEMENT](state, action) {
      const id = action.payload;
      const descendantIds = getAllDescendantIds(state, id);
      return deleteMany(state, [id, ...descendantIds]);
    },
    [combineActions(CREATE_ELEMENT, UPDATE_ELEMENT, ADD_CHILD, REMOVE_CHILD, MOVE_CHILD)](
      state,
      action
    ) {
      const { id } = action.payload;

      const preState = state[id];
      const nextState = node(preState, action);
      if (preState === nextState) {
        return preState;
      }

      return {
        ...state,
        [id]: nextState,
      };
    },
  },
  initialState
);

export const selectElements = state => {
  return state.elements;
};

export const selectArtBord = createSelector(selectElements, elements => elements[artboard.id]);

export const selectElement = (state, id) => {
  const elements = selectElements(state);
  return elements[id];
};
