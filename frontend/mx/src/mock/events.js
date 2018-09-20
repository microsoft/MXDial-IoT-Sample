import axios from 'axios';
import {
  MIN_ATMOSPHERIC_PRESSURE,
  MAX_ATMOSPHERIC_PRESSURE,
  MAX_MAGNETIC_FLUX_DENSITY,  // milliGauss
  MAX_TEMPERATURE,
  MAX_SOUND_LEVEL
} from '../common/constants';

class RandomValueGenerator {
  constructor(min, max, isFloat) {
    this.min = min;
    this.max = max;
    this.isFloat = isFloat;
  }
  getValue() {
    const range = this.isFloat ? Math.abs(this.max - this.min) : Math.abs(this.max - this.min) + 1;
    let value = Math.random() * range;
    value = this.isFloat ? value : Math.floor(value);
    return value + this.min;
  }
}

class RandomDeviceEventGenerator {
  constructor(devices, callback) {
    this.devices = devices.map(deviceId => ({
      id: deviceId,
      type: 1,
    }));
    this.callback = callback;
    this.temperatureGenerator = new RandomValueGenerator(
      16,   // farenheit
      MAX_TEMPERATURE,
      true
    );
    this.soundGenerator = new RandomValueGenerator(0, MAX_SOUND_LEVEL, true);
    this.humidityGenerator = new RandomValueGenerator(60, 80, true);
    this.speedGenerator = new RandomValueGenerator(0, 5.0, true);
    this.pressureGenerator = new RandomValueGenerator(
      MIN_ATMOSPHERIC_PRESSURE,
      MAX_ATMOSPHERIC_PRESSURE,
      true
    );
    this.magnetometerGenerator = new RandomValueGenerator(0, MAX_MAGNETIC_FLUX_DENSITY, true);
  }

  broadcastEvent = event => {
    axios({
      crossDomain: true,
      method: 'POST',
      url: `${process.env.REACT_APP_MX_API}/api/ionic/hub`,
      data: event,
    });
  };

  generateEvent = () => {
    const device = this.devices[0];
    return {
      ...device,
      temperature: this.temperatureGenerator.getValue(),
      humidity: this.humidityGenerator.getValue(),
      gravity: this.speedGenerator.getValue(),
      pressure: this.pressureGenerator.getValue(),
      decibels: this.soundGenerator.getValue(),
      magnetometer: this.magnetometerGenerator.getValue(),
    };
  };

  start = time => {
    const timeBetweenEvents = time || 1000;

    setInterval(() => {
      const event = this.generateEvent();
      if (this.callback && typeof this.callback === 'function') {
        this.callback(event);
      } else {
        this.broadcastEvent(event);
      }
    }, timeBetweenEvents);
  };
}

export default function runMockEvents(timeBetweenEvents, callback) {
  const devices = ['AZ3166'];
  const eventGenerator = new RandomDeviceEventGenerator(devices, callback);

  eventGenerator.start(timeBetweenEvents);
}
