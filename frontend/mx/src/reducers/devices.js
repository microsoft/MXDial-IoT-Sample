import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

/* --- SELECTORS */
export const getAll = state => state.allIds.map(id => state.byId[id]);
export const get = (state, id) => state.byId[id];

/* --- REDUCERS */
const byId = handleActions(
  {
    'DEVICE/SETUP': (state, action) => ({
      ...state,
      [action.payload.id]: { ...action.payload },
    }),
    'DEVICE/UPDATE': (state, action) => ({
      ...state,
      [action.payload.id]: { ...action.payload },
    }),
    RESET: (state, action) => ({}),
  },
  {}
);

const allIds = handleActions(
  {
    'DEVICE/SETUP': (state, action) => {
      // Do not add key if it already exists
      const result = new Set([...state, action.payload.id]);
      return [...result];
    },
    RESET: (state, action) => [],
  },
  []
);

const reducers = combineReducers({
  byId,
  allIds,
});

export default reducers;
