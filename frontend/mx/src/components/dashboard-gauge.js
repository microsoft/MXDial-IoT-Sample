import React, { Component } from 'react';
import styled from 'styled-components';
import RoundGauge from './round-gauge';

const Styled = styled.div`
  &.dashboard-gauge {
    position: relative;
    align-items: center;
    display: flex;
    flex-direction: column;

    .info {
      position: absolute;
      bottom: 5.6rem;
      left: 5%;
      width: 90%;
      font-size: 0.9rem;
      border-width: 1px;
      border-style: solid;
      border-radius: 8px;
      padding: 10px;
      box-sizing: border-box;
      z-index: 10;
      background-color: white;
      color: #717171;
      line-height: 1.4;
      transform: translateY(-7rem);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;

      &.is-visible {
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.3s, opacity 0.5s;
      }
    }

    .header {
      width: 100%;
      text-align: center;
      margin-bottom: 0.3rem;

      .icon {
        fill: ${props => props.color};
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

    .round-gauge {
      width: 100%;
      max-width: 280px;
    }

    &.temperature-gauge {
      .header .icon {
        height: 40px;
      }
    }
  }
`;

class DashboardGauge extends Component {
  state = {
    isInfoTextVisible: false,
  };

  showInfoText = () => {
    this.setState({ isInfoTextVisible: true });
  };

  hideInfoText = () => {
    this.setState({ isInfoTextVisible: false });
  }

  render() {
    const {
      className,
      color,
      icon: Icon,
      label,
      title,
      dialRotation,
      dialValue,
      isTemperature,
      infoText,
    } = this.props;
    const { isInfoTextVisible } = this.state;
    const classes = `dashboard-gauge ${className}`;
    const infoTextClass = 'info' + (isInfoTextVisible ? ' is-visible' : '');

    return (
      <Styled className={classes} color={color}>
        <span className={infoTextClass} style={{ borderColor: color }}>
          {infoText}
        </span>
        <div className="header">
          <Icon />
          <h3>{title}</h3>
        </div>
        <RoundGauge
          color={color}
          dialRotation={dialRotation}
          dialValue={dialValue}
          label={label}
          isTemperature={isTemperature}
          onValueMouseEnter={this.showInfoText}
          onValueMouseLeave={this.hideInfoText}
        />
      </Styled>
    );
  }
}

export default DashboardGauge;
