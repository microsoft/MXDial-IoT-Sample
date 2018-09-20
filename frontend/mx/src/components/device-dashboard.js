import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import styled from 'styled-components';
import MXChipShaking from '../images/mx_chip_angled_shaking.gif';
import TriggerOverlay from './trigger-overlay';
import Accelerometer from './accelerometer';
import AtmosphericPressureGauge from './atmospheric-pressure-gauge';
import HumidityLevelGauge from './humidity-level-gauge';
import MagnetometerGauge from './magnetometer-gauge';
import SoundLevelGauge from './sound-level-gauge';
import SendMessage from '../containers/send-message';
import TemperatureGauge from './temperature-gauge';
import { TRIGGER_LABEL_MOVEMENT } from '../common/constants';

const Styled = styled.div`
  &.device-dashboard {
    height: 100%;
    width: 88vw;
    display: flex;
    flex-wrap: nowrap;
    padding: 0 4vw;
    align-items: center;
    position: absolute;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.6s ease-in 0.8s;
    overflow: hidden;

    .image {
      width: 28vw;
      position: relative;

      img {
        width: 100%;
        max-width: 445px;
        margin-left: 40px;

        &.shaking {
          max-width: 525px;
          margin-left: 0;
        }
      }

      h1 {
        color: #777777;
        font-size: 2rem;
        font-weight: normal;
        margin: 0;
        text-align: center;
      }

      .info {
        text-align: center;
        position: relative;

        h1 {
          opacity: 1;
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
        }

        b {
          opacity: 0;
          display: inline-block;
          font-weight: normal;
          text-transform: capitalize;
          font-size: 2rem;
          color: rgba(241, 80, 33, 0.85);
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
        }

        &.title {
          h1 {
            transition: opacity 0.5s linear 0.4s;
          }
          b {
            transition: opacity 0.4s;
          }
        }

        &.trigger {
          h1 {
            opacity: 0;
            transition: opacity 0.4s;
          }
          b {
            opacity: 1;
            transition: opacity 0.5s linear 0.4s;
          }
        }
      }

      .trigger-overlay {
        position: absolute;
        top: 46%;
        left: 42%;
        transform: translate(-42%, -46%);
      }
    }

    .content {
      position: relative;

      .metrics {
        width: 60vw;
        max-width: 1130px;
        opacity: 0;
        transition: opacity 0.6s ease-out 0s;

        .temperature-monitor {
          margin-bottom: 5vw;
          padding: 0 4.5vw;
        }
        section {
          display: flex;

          > div {
            flex: 1;
          }

          &:first-child {
            margin-bottom: 2vh;
          }
        }

        &.is-visible {
          opacity: 1;
        }
      }

      .send-message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        bottom: 0;
        left: 15%;
        transform: translateY(50vh);
        transition: transform 0.8s ease-out;

        form {
          width: 100%;
        }

        &.is-visible {
          transform: translateY(-15vh);
        }
      }
    }

    &.is-visible {
      z-index: 1;
      opacity: 1;
    }
  }
`;

function sendMessage(device, message) {
  return axios({
    crossDomain: true,
    method: 'POST',
    url: `${process.env.REACT_APP_MX_API}/api/mx/device-messages`,
    data: {
      deviceId: device.id,
      messageContents: message,
    },
  });
}

const DeviceDashboard = ({
  device,
  image,
  isVisible,
  isThresholdExceeded,
  step,
  trigger,
}) => {
  const classes = classNames('device-dashboard', {
    'is-visible': isVisible,
  });

  if (!device) return <Styled className={classes} />;

  const {
    id,
    temperature,
    gravity,
    humidity,
    pressure,
    decibels,
    magnetometer,
  } = device;

  const thresholdRuleText = trigger ? `${trigger.name} rule set` : '';

  const infoClasses = classNames('info', {
    title: step <= 3 || isThresholdExceeded,
    trigger: step === 4 && !isThresholdExceeded,
  });
  const metricsClasses = classNames('metrics', {
    'is-visible': step === 1 || step === 4,
  });
  const sendMessageClass = classNames({
    'is-visible': step === 2,
  });

  return (
    <Styled className={classes}>
      <div className="image">
        {isThresholdExceeded && trigger.name === TRIGGER_LABEL_MOVEMENT ? (
          <img src={MXChipShaking} className="shaking" alt="" />
        ) : (
          <img src={image} alt="" />
        )}
        <div className={infoClasses}>
          <h1>{id}</h1>
          <b>{thresholdRuleText}</b>
        </div>
        <TriggerOverlay
          trigger={trigger}
          isThresholdExceeded={isThresholdExceeded}
        />
      </div>
      <div className="content">
        <div className={metricsClasses}>
          <section>
            <Accelerometer acceleration={gravity} />
            <SoundLevelGauge sound={decibels} />
            <MagnetometerGauge value={magnetometer} />
          </section>
          <section>
            <TemperatureGauge temperature={temperature} />
            <HumidityLevelGauge humidity={humidity} />
            <AtmosphericPressureGauge pressure={pressure} />
          </section>
        </div>
        <SendMessage
          className={sendMessageClass}
          onSend={sendMessage.bind(null, device)}
        />
      </div>
    </Styled>
  );
};

export default DeviceDashboard;
