import { createActions } from 'redux-actions';

const actions = createActions({
  DEVICE: {
    SETUP: undefined,
    UPDATE: undefined,
  },
  RESET: undefined,
  STEP: {
    INCREMENT: undefined,
    SET: undefined,
  },
});

export const setupDevice = data => dispatch => {
  dispatch(actions.device.setup(data));
};

export const updateDevice = data => dispatch => {
  dispatch(actions.device.update(data));
};

export const nextStep = () => dispatch => {
  dispatch(actions.step.increment());
};

export const setStep = stepNumber => dispatch => {
  dispatch(actions.step.set(stepNumber));
};

export const resetDemo = (devices, callback) => dispatch => {
  dispatch(actions.reset());
};
