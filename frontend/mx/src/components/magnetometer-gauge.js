import React from 'react';
import DashboardGauge from './dashboard-gauge';
import MagnetometerIcon from '../icons/magnetism';
import { MAX_MAGNETIC_FLUX_DENSITY } from '../common/constants';

const MagnetometerGauge = ({ value }) => {
  const roundedMagnetLevel = value.toFixed(1);
  const degValue = value * 244 / MAX_MAGNETIC_FLUX_DENSITY - 122;
  const infoText =
    'This sensor will measure the magnetization of a magnetic material like a ' +
    'ferromagnet, or to measure the strength and, in some cases, the ' +
    'direction of the magnetic field at a point in space. Put something made ' +
    'of steel over the sensor, such as a bottle cap or your phone. You will ' +
    'see the dashboard mG value update.';

  return (
    <DashboardGauge
      className="magnetometer-gauge"
      color="#ffca41"
      icon={MagnetometerIcon}
      label="MilliGauss"
      title="Magnetometer"
      dialRotation={degValue}
      dialValue={roundedMagnetLevel}
      infoText={infoText}
    />
  );
};

export default MagnetometerGauge;
