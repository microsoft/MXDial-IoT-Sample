import React from 'react';
import styled from 'styled-components';
import { MAX_TEMPERATURE } from '../common/constants';

const icon = require(`../icons/temperature.svg`);
const monitorBackground = require(`../icons/temperature_scale.svg`);

const Styled = styled.div`
  &.temperature-monitor {
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      text-align: center;
      margin-bottom: 0.8rem;

      img {
        width: 35px;
      }
      h3 {
        display: inline-block;
        color: black;
        margin: 0 0 0 0.5rem;
        font-size: 1.3vw;
        font-weight: normal;
        font-family: SegoeUISemilight, 'Helvetica Neue', Helvetica, Arial,
          sans-serif;
        vertical-align: top;
      }
    }

    .content {
      .text {
        display: flex;
        flex-direction: column;
        float: left;
        min-width: 4.2rem;
        text-align: left;

        span {
          display: block;
          color: #f15021;
          font-size: 1.75rem;
          font-family: SegoeUISemilight, 'Helvetica Neue', Helvetica, Arial,
            sans-serif;

          em {
            font-style: normal;
            font-family: SegoeUISemibold, 'Helvetica Neue', Helvetica, Arial,
              sans-serif;
          }
        }
      }

      .chart {
        position: relative;
        height: 80px;
        display: inline-block;
        margin-left: 1.3rem;

        .background {
          height: inherit;
          width: 100%;
        }

        .value {
          position: absolute;
          top: calc(50% - 0.65rem);
          left: 0;
          height: 1.3rem;
          background-color: #f15021;
          transition: width 0.3s;
        }
      }
    }
  }
`;

const TemperatureMonitor = ({ temperature, width }) => {
  const temperatureInFahrenheit = Math.round(temperature);
  const temperatureInCelsius = Math.round((temperature - 32) * 5 / 9);
  let barWidth = temperatureInFahrenheit * width / MAX_TEMPERATURE;
  barWidth = `${barWidth}px`;

  return (
    <Styled className="temperature-monitor">
      <div className="header">
        <img src={icon} alt="" />
        <h3>Temperature</h3>
      </div>
      <div className="content">
        <div className="text">
          <span>
            <em>{temperatureInFahrenheit}</em>°F
          </span>
          <span>
            <em>{temperatureInCelsius}</em>°C
          </span>
        </div>
        <div className="chart" style={{ width: `${width}px` }}>
          <img className="background" src={monitorBackground} alt="" />
          <div className="value" style={{ width: barWidth }} />
        </div>
      </div>
    </Styled>
  );
};

export default TemperatureMonitor;
