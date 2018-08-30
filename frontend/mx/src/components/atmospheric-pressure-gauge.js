import React from 'react';
import DashboardGauge from './dashboard-gauge';
import PressureIcon from '../icons/pressure';
import {
  MIN_ATMOSPHERIC_PRESSURE,
  MAX_ATMOSPHERIC_PRESSURE,
} from '../common/constants';

const AtmosphericPressureGauge = ({ pressure }) => {
  const roundedSoundLevel = pressure.toFixed(1);
  // Make sure pressure readings below the MIN threshold won't result in a negative value
  const degValue =
    (100 -
      (MAX_ATMOSPHERIC_PRESSURE -
        Math.max(pressure, MIN_ATMOSPHERIC_PRESSURE))) *
      244 /
      100 -
    122;
  const infoText =
    'This sensor will display the atmospheric pressure in MilliBars of your ' +
    'current location. You can manipulate this value if you put it on the ' +
    'floor or above your head.';

  return (
    <DashboardGauge
      className="atmospheric-pressure-gauge"
      color="#ffca41"
      icon={PressureIcon}
      label="Millibars"
      title="Atmospheric Pressure"
      dialRotation={degValue}
      dialValue={roundedSoundLevel}
      infoText={infoText}
    />
  );
};

export default AtmosphericPressureGauge;
