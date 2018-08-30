import AccelerometerIcon from 'common/icons/accelerometer';
import HumidityIcon from '../icons/humidity';
import MagnetometerIcon from '../icons/magnetism';
import PressureIcon from '../icons/pressure';
import SoundIcon from '../icons/sound';
import TemperatureIcon from '../icons/temperature';

export const MIN_ATMOSPHERIC_PRESSURE = 950;
export const MAX_ATMOSPHERIC_PRESSURE = 1050;
export const MAX_DEVICES = 1;
export const MAX_HUMIDITY = 100;
export const MAX_SOUND_LEVEL = 100;
export const MAX_TEMPERATURE = 100.0; // Farenheit
export const MAX_MAGNETIC_FLUX_DENSITY = 10000; // milliGauss

export const DEVICE_IMAGE_MAP = {
  1: {
    label: 'MX Chip',
    angled: 'mx_chip_angled.png',
    shaking: 'mx_chip_angled_shaking.gif',
  },
};

export const DEFAULT_DEVICE_TYPE = Object.keys(DEVICE_IMAGE_MAP)[0];

export const TRIGGER_LABEL_HUMIDITY = 'humidity';
export const TRIGGER_LABEL_MAGNETISM = 'magnetism';
export const TRIGGER_LABEL_MOVEMENT = 'movement';
export const TRIGGER_LABEL_PRESSURE = 'pressure';
export const TRIGGER_LABEL_SOUND = 'sound';
export const TRIGGER_LABEL_TEMPERATURE = 'temperature';

export const TRIGGERS = [
  {
    name: TRIGGER_LABEL_MOVEMENT,
    label: 'Tweet if g-force exceeds',
    icon: AccelerometerIcon,
    message: {
      threshold: 'g-force',
      unit: 'g',
    },
  },
  {
    name: TRIGGER_LABEL_SOUND,
    label: 'Tweet if decibels exceed',
    icon: SoundIcon,
    message: {
      threshold: 'decibel',
      unit: ' decibels',
    },
  },
  {
    name: TRIGGER_LABEL_MAGNETISM,
    label: 'Tweet if magnetometer exceeds',
    icon: MagnetometerIcon,
    message: {
      threshold: 'magnetic',
      unit: ' milliGauss',
    },
  },
  {
    name: TRIGGER_LABEL_TEMPERATURE,
    label: 'Tweet if temperature (°F) exceeds',
    icon: TemperatureIcon,
    message: {
      threshold: 'temperature',
      unit: '°F',
    },
  },
  {
    name: TRIGGER_LABEL_HUMIDITY,
    label: 'Tweet if the percentage of humidity exceeds',
    icon: HumidityIcon,
    message: {
      threshold: 'humidity',
      unit: ' percent',
    },
  },
  {
    name: TRIGGER_LABEL_PRESSURE,
    label: 'Tweet if the atmospheric pressure exceeds',
    icon: PressureIcon,
    message: {
      threshold: 'atmospheric pressure',
      unit: 'mb',
    },
  },
];
