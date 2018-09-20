import { combineReducers } from 'redux';
import devices, * as deviceSelectors from './devices';
import step, * as stepSelectors from './step';

export const getAllDevices = state => deviceSelectors.getAll(state.devices);
export const getDevice = (state, id) => deviceSelectors.get(state.devices, id);
export const getCurrentStep = state => stepSelectors.get(state.step);

const reducers = combineReducers({
  devices,
  step,
});

export default reducers;
