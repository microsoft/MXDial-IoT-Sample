import React, { Component } from 'react';
import DashboardGauge from './dashboard-gauge';
import SoundIcon from '../icons/sound';
import { MAX_SOUND_LEVEL } from '../common/constants';

class SoundLevelGauge extends Component {
  shouldComponentUpdate({ sound }) {
    return sound > 0;
  }

  render() {
    const { sound } = this.props;
    const roundedSoundLevel = sound.toFixed(1);
    const degValue = sound * 244 / MAX_SOUND_LEVEL - 122;
    const infoText =
      'Sound is the only sensor that needs input from the MX Device directly. ' +
      'It will record a sound and get the average DB reading from the raw WAV file. ' +
      'Hold down the \'B\' button on your MX Chip and record sound. ' +
      'Release to stop recording and the value will be sent to the hub.';

    return (
      <DashboardGauge
        className="sound-level-gauge"
        color="#02a3ee"
        icon={SoundIcon}
        label="Decibels"
        title="Sound Levels"
        dialRotation={degValue}
        dialValue={roundedSoundLevel}
        infoText={infoText}
      />
    );
  }
}

export default SoundLevelGauge;
