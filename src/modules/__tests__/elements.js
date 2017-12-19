import reducer, {
  initialState,
  createElementAt,
  createElement,
  deleteElement,
  addChild,
  moveChild,
  insertChildBeforeIndex,
  removeChild,
  moveChildToAnotherBeforeIndex,
  updateElement,
} from '../elements';
import { configStore } from '../store';

function deepFreeze(o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (
      Object.hasOwnProperty.call(o, prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

describe('reducer', () => {
  let store;

  it('should provide the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should createElement and add it as a child to target', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        childIds: [],
      },
    };
    store = configStore(reducer, stateBefore);
    let action = createElementAt('node_0', 'type');
    action = store.dispatch(action);
    const stateAfter = {
      node_0: {
        id: 'node_0',
        childIds: [action.payload.childId],
      },
      [action.payload.childId]: {
        id: action.payload.childId,
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(store.getState()).toMatchObject(stateAfter);
  });

  it('should handle CREATE_NODE action', () => {
    const stateBefore = {};
    const action = createElement('typea');
    const stateAfter = {
      [action.payload.id]: {
        id: action.payload.id,
        childIds: [],
        name: action.payload.name,
        type: 'typea',
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should handle DELETE_NODE action', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        childIds: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        childIds: [],
      },
      node_2: {
        id: 'node_2',
        childIds: ['node_3', 'node_4'],
      },
      node_3: {
        id: 'node_3',
        childIds: [],
      },
      node_4: {
        id: 'node_4',
        childIds: [],
      },
    };
    const action = deleteElement('node_2');
    const stateAfter = {
      node_0: {
        id: 'node_0',
        childIds: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  describe('handle UPDATE_ELEMENT action', () => {
    let stateBefore;

    beforeEach(() => {
      stateBefore = {
        node_0: {
          id: 'node_0',
          counter: 0,
          childIds: ['node_0', 'node_1'],
        },
      };
    });

    it('update element props', () => {
      const action = updateElement('node_0', { counter: 1 });
      const stateAfter = {
        node_0: {
          id: 'node_0',
          counter: 1,
          childIds: ['node_0', 'node_1'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toMatchObject(stateAfter);
    });
  });

  describe('should handle ADD_CHILD action', () => {
    let stateBefore;

    beforeEach(() => {
      stateBefore = {
        node_0: {
          id: 'node_0',
          counter: 0,
          childIds: ['node_0', 'node_1'],
        },
        node_1: {
          id: 'node_1',
          counter: 0,
          childIds: [],
        },
      };
    });
    it('with no params', () => {
      const action = insertChildBeforeIndex('node_0', 'node_2');
      const stateAfter = {
        node_0: {
          id: 'node_0',
          counter: 0,
          childIds: ['node_0', 'node_1', 'node_2'],
        },
        node_1: {
          id: 'node_1',
          counter: 0,
          childIds: [],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('with beforeIndex', () => {
      const action = insertChildBeforeIndex('node_0', 'node_2', 1);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          counter: 0,
          childIds: ['node_0', 'node_2', 'node_1'],
        },
        node_1: {
          id: 'node_1',
          counter: 0,
          childIds: [],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('with beforeIndex out of bound', () => {
      const action = addChild('node_0', 'node_2', 2);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          counter: 0,
          childIds: ['node_0', 'node_1', 'node_2'],
        },
        node_1: {
          id: 'node_1',
          counter: 0,
          childIds: [],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('should handle MOVE_CHILD action', () => {
    let stateBefore;
    beforeEach(() => {
      stateBefore = {
        node_0: {
          id: 'node_0',
          childIds: ['node_1', 'node_2', 'node_3'],
        },
      };
    });

    it('should move child', () => {
      const action = moveChild('node_0', 'node_1', 2);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          childIds: ['node_2', 'node_1', 'node_3'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('should move child case 1', () => {
      const action = moveChild('node_0', 'node_2', 1);
      const stateAfter = { node_0: { id: 'node_0', childIds: ['node_1', 'node_2', 'node_3'] } };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
      expect(reducer(stateBefore, action).node_0.childIds).toBe(stateBefore.node_0.childIds);
    });

    // it('should move child case 2', () => {
    //   const action = moveChild('node_0', 'node_1', 2);
    //   const stateAfter = { node_0: { id: 'node_0', childIds: ['node_2', 'node_3', 'node_1'] } };

    //   deepFreeze(stateBefore);
    //   deepFreeze(action);

    //   expect(reducer(stateBefore, action)).toEqual(stateAfter);
    // });

    it('should not move child when postion not changed', () => {
      const action = moveChild('node_0', 'node_1', 0);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          childIds: ['node_1', 'node_2', 'node_3'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
      expect(reducer(stateBefore, action).node_0.childIds).toBe(stateBefore.node_0.childIds);
    });

    it('should not move child when child not exist', () => {
      const action = moveChild('node_0', 'node_4', 0);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          childIds: ['node_1', 'node_2', 'node_3'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
      expect(reducer(stateBefore, action).node_0.childIds).toBe(stateBefore.node_0.childIds);
    });

    it('should move child when index left out of bound', () => {
      const action = moveChild('node_0', 'node_2', -1);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          childIds: ['node_2', 'node_1', 'node_3'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('should move child when index right out of bound', () => {
      const action = moveChild('node_0', 'node_2', 5);
      const stateAfter = {
        node_0: {
          id: 'node_0',
          childIds: ['node_1', 'node_3', 'node_2'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  it('should handle REMOVE_CHILD action', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        counter: 0,
        childIds: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        counter: 0,
        childIds: [],
      },
    };
    const action = removeChild('node_0', 'node_1');
    const stateAfter = {
      node_0: {
        id: 'node_0',
        counter: 0,
        childIds: [],
      },
      node_1: {
        id: 'node_1',
        counter: 0,
        childIds: [],
      },
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  describe('moveChildToAnotherBeforeIndex', () => {
    it('move child to another', () => {
      const stateBefore = {
        node_from: {
          id: 'node_from',
          childIds: ['node_1', 'node_2', 'node_3'],
        },
        node_to: {
          id: 'node_to',
          childIds: ['node_4', 'node_5'],
        },
      };
      store = configStore(reducer, stateBefore);
      const action = moveChildToAnotherBeforeIndex('node_from', 'node_2', 'node_to', 1);
      store.dispatch(action);
      const stateAfter = {
        node_from: {
          id: 'node_from',
          childIds: ['node_1', 'node_3'],
        },
        node_to: {
          id: 'node_to',
          childIds: ['node_4', 'node_2', 'node_5'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(store.getState()).toMatchObject(stateAfter);
    });

    it('move child between self', () => {
      const stateBefore = {
        node_from: {
          id: 'node_from',
          childIds: ['node_1', 'node_2', 'node_3'],
        },
      };
      store = configStore(reducer, stateBefore);
      const action = moveChildToAnotherBeforeIndex('node_from', 'node_2', 'node_from', 0);
      store.dispatch(action);
      const stateAfter = {
        node_from: {
          id: 'node_from',
          childIds: ['node_2', 'node_1', 'node_3'],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(store.getState()).toMatchObject(stateAfter);
    });
  });
});
