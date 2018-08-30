import React from 'react';
import DashboardGauge from './dashboard-gauge';
import TemperatureIcon from '../icons/temperature';
import { MAX_TEMPERATURE } from '../common/constants';

const TemperatureGauge = ({ temperature }) => {
  const temperatureInFahrenheit = Math.round(temperature);
  const degValue = temperatureInFahrenheit * 244 / MAX_TEMPERATURE - 122;
  const infoText =
    'This sensor measures in Celsius - however - we convert this to Fahrenheit ' +
    'in the dashboard. It will usually stay quiet stable at room temperature. ' +
    'Putting the chip between both palms of your hands will increase the temperature.';

  return (
    <DashboardGauge
      className="temperature-gauge"
      color="#80ba01"
      icon={TemperatureIcon}
      title="Temperature"
      dialRotation={degValue}
      dialValue={temperatureInFahrenheit}
      isTemperature={true}
      infoText={infoText}
    />
  );
};

export default TemperatureGauge;
