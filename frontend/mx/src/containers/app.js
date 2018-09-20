import React from 'react';
import { connect } from 'react-redux';
import {
  nextStep,
  resetDemo,
  setStep,
  setupDevice,
  updateDevice,
} from '../actions';
import ThresholdNotifications from './threshold-notifications';
import AppComponent from '../components/app';
import * as selectors from '../reducers';
import {
  MAX_DEVICES,
  TRIGGER_LABEL_HUMIDITY,
  TRIGGER_LABEL_MAGNETISM,
  TRIGGER_LABEL_MOVEMENT,
  TRIGGER_LABEL_PRESSURE,
  TRIGGER_LABEL_SOUND,
  TRIGGER_LABEL_TEMPERATURE,
} from '../common/constants';
import runMockEvents from '../mock/events';

class App extends React.Component {
  registeredDevices = new Set();

  state = {
    selectedDeviceIdx: null,
    ruleThreshold: null,
    trigger: null,
    isThresholdExceeded: false,
  };

  componentDidMount() {
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.REACT_APP_SIMULATE
    ) {
      runMockEvents(1000, this.setupOrUpdateDevice);
    }

    this.subscribeToHub();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.devices.length !== nextProps.devices.length &&
      nextProps.devices.length > 0
    ) {
      this.setState({ selectedDeviceIdx: 0 });
    }

    const {
      selectedDeviceIdx,
      ruleThreshold,
      trigger,
      isThresholdExceeded,
    } = this.state;

    const device = nextProps.devices[selectedDeviceIdx];

    if (
      device &&
      !isThresholdExceeded &&
      typeof ruleThreshold === 'number' &&
      typeof selectedDeviceIdx === 'number'
    ) {
      let deviceTriggerValue;

      switch (trigger.name) {
        case TRIGGER_LABEL_HUMIDITY:
          deviceTriggerValue = device.humidity;
          break;
        case TRIGGER_LABEL_MAGNETISM:
          deviceTriggerValue = device.magnetometer;
          break;
        case TRIGGER_LABEL_MOVEMENT:
          deviceTriggerValue = device.gravity;
          break;
        case TRIGGER_LABEL_PRESSURE:
          deviceTriggerValue = device.pressure;
          break;
        case TRIGGER_LABEL_SOUND:
          deviceTriggerValue = device.decibels;
          break;
        case TRIGGER_LABEL_TEMPERATURE:
          deviceTriggerValue = device.temperature;
          break;
        default:
          //
          deviceTriggerValue = 0;
      }
      if (deviceTriggerValue > ruleThreshold) {
        this.setState({ isThresholdExceeded: true });
      }
    }
  }

  componentWillUnmount() {
    window.$.connection.hub.stop();
  }

  subscribeToHub = () => {
    const $ = window.$;
    $.connection.hub.url = `${process.env.REACT_APP_MX_API}/signalr/hubs`;

    $.connection.messageHub.client.message = message => {
      const deviceData = JSON.parse(message);
      this.setupOrUpdateDevice(deviceData);
    };
    $.connection.hub.start().done(function() {
      console.log('Listening to messages from SignalR Hub ...');
    });
  };

  startOver = () => {
    const { devices, resetDemo } = this.props;
    this.setState({
      selectedDeviceIdx: null,
      ruleThreshold: null,
      trigger: null,
      isThresholdExceeded: false,
    });
    resetDemo(devices);

    // Clear device registy until all devices have been reset
    this.registeredDevices.clear();
  };

  setupOrUpdateDevice = device => {
    const { setupDevice, updateDevice, step } = this.props;
    const deviceId = device.id.toLowerCase();   // match is case-insensitive

    if (this.registeredDevices.has(deviceId)) {
      updateDevice(device);
    } else {
      if (
        this.registeredDevices.size < MAX_DEVICES &&
        step === 1 &&
        deviceId === this.props.deviceId
      ) {
        this.registeredDevices.add(deviceId);
        setupDevice(device);
      }
    }
  };

  setThreshold = (trigger, threshold) => {
    this.setState({
      trigger: trigger,
      ruleThreshold: threshold,
    });
  };

  render() {
    const { devices } = this.props;
    const { trigger, ruleThreshold } = this.state;
    const { selectedDeviceIdx, isThresholdExceeded } = this.state;
    const device = devices.length > 0 && devices[selectedDeviceIdx];

    return (
      <ThresholdNotifications
        deviceId={device.id}
        trigger={trigger}
        thresholdValue={ruleThreshold}
        isThresholdExceeded={isThresholdExceeded}
      >
        <AppComponent
          {...this.props}
          numDevices={devices.length}
          device={device}
          onReset={this.startOver}
          setThreshold={this.setThreshold}
          trigger={trigger}
          isThresholdExceeded={isThresholdExceeded}
        />
      </ThresholdNotifications>
    );
  }
}

const mapStateToProps = state => ({
  devices: selectors.getAllDevices(state),
  step: selectors.getCurrentStep(state),
});

App = connect(mapStateToProps, {
  nextStep,
  resetDemo,
  setStep,
  setupDevice,
  updateDevice,
})(App);
export default App;
