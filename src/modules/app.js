import { handleActions } from 'redux-actions';

const INIT_APP = 'INIT_APP';

const initState = {
  isInit: false,
};

const reducer = handleActions({
  [INIT_APP](state: {}, _) {
    return state;
  },
}, initState);

export default reducer;
