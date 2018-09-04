import { Component } from 'react';
import axios from 'axios';

class DeviceProvider extends Component {
  state = {
    deviceId: null,
  };

  setDeviceId = id => {
    window.sessionStorage.setItem('deviceId', id);
    this.setState({ deviceId: id });
  };

  render() {
    const { deviceId } = this.state;
    if (!deviceId) return null;
    return this.props.children(deviceId);
  }
}

export default DeviceProvider;
