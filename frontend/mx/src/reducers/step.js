import { handleActions } from 'redux-actions';

export const get = state => state;

const reducer = handleActions(
  {
    'STEP/INCREMENT': (state) => (state + 1),
    'STEP/SET': (state, action) => (action.payload),
    RESET: () => 1,
  },
  1
);

export default reducer;
