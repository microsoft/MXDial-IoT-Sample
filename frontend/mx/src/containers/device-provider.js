import { Component } from 'react';
import axios from 'axios';

class DeviceProvider extends Component {
  state = {
    deviceId: null,
  };

  componentDidMount() {
    // Clear any previous data
    window.sessionStorage.clear();

    // Fetch device names
    axios
      .get(`${process.env.REACT_APP_MX_API}/api/mx/GetDeviceId`)
      .then(response => {
        let deviceId = response.headers && response.headers.deviceid;
        if (deviceId && typeof deviceId === 'string') {
          deviceId = deviceId.toLowerCase();
          this.setState({ deviceId });
        }
      })
      .catch(() => {
        // Problem loading device id
        console.warn('Unable to load device id from endpoint'); // eslint-disable-line
      });
  }

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
