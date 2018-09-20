import React from 'react';
import DashboardGauge from './dashboard-gauge';
import HumidityIcon from '../icons/humidity';
import { MAX_HUMIDITY } from '../common/constants';

const HumidityLevelGauge = ({ humidity }) => {
  const roundedSoundLevel = humidity.toFixed(1);
  const degValue = humidity * 244 / MAX_HUMIDITY - 122;
  const infoText =
    'The sensor will display the surrounding humidity reading between 0 - 100%. ' +
    'You can cup your hands and breathe onto the device to increase the values.';

  return (
    <DashboardGauge
      className="humidity-level-gauge"
      color="#02a3ee"
      icon={HumidityIcon}
      label="Percent"
      title="Humidity"
      dialRotation={degValue}
      dialValue={roundedSoundLevel}
      infoText={infoText}
    />
  );
};

export default HumidityLevelGauge;
