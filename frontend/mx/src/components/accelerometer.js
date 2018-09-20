import React from 'react';
import DashboardGauge from './dashboard-gauge';
import AccelerometerIcon from 'common/icons/accelerometer';

const Accelerometer = ({ acceleration }) => {
  const roundedAcceleration = acceleration.toFixed(2);
  const degValue = acceleration * 244 / 10 - 122;
  const infoText =
    'We calculate the G-Force from the 3 accelerometer readings. ' +
    'We first divide each value by gravity (9.81) then apply the Pythagorean ' +
    'theorem. This gives us a resting G-force of around 1g. You can easily ' +
    'shake your device around and you will see the amount of G\'s increase.';

  return (
    <DashboardGauge
      className="accelerometer"
      color="#80ba01"
      icon={AccelerometerIcon}
      label="G-force"
      title="Accelerometer"
      dialRotation={degValue}
      dialValue={roundedAcceleration}
      infoText={infoText}
    />
  );
};

export default Accelerometer;
