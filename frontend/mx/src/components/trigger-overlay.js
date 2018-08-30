import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import TwitterIcon from '../icons/twitter';

const Styled = styled.div`
  &.trigger-overlay {
    background-color: #f15021;
    border-radius: 8px;
    color: white;
    padding: 25px 20px 15px;
    opacity: 0;
    transition: opacity 0.6s ease-out;

    .icon {
      display: block;
      width: 96px;
      margin: 0 auto 5px;
      fill: white;
    }

    span {
      font-family: SegoeUISemibold, 'Helvetica Neue', Helvetica, Arial,
        sans-serif;
    }

    > span {
      display: block;
      text-align: center;
      font-size: 14px;
    }

    > a {
      background-color: white;
      border-radius: 9999px;
      color: #f15021;
      margin: 12px auto 0;
      padding: 3px 12px 3px 34px;
      position: relative;
      display: block;
      text-decoration: none;

      .icon {
        fill: #f15021;
        width: 38px;
        position: absolute;
        top: -5px;
        left: 0px;
      }
    }

    &.is-visible {
      opacity: 0.85;
    }
  }
`;

class TriggerOverlay extends Component {
  state = {
    twitterUrl: null
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_MX_API}/api/mx/TwitterAccount`)
      .then(response => {
        if (response.data && typeof response.data === 'string') {
          this.setState({ twitterUrl: response.data });
        }
      });
  }

  render() {
    const { trigger, isThresholdExceeded } = this.props;
    const { twitterUrl } = this.state;

    if (!trigger) return null;

    const isVisible = isThresholdExceeded ? 'is-visible' : '';
    const classes = `trigger-overlay ${isVisible}`;
    const TriggerIcon = trigger.icon;

    return (
      <Styled className={classes}>
        <TriggerIcon />
        <span>Rule trigger met</span>
        { twitterUrl && (
          <a
            href={twitterUrl}
            target="_blank"
            className="twitter"
          >
            <TwitterIcon />
            <span>Twitter</span>
          </a>
        )}
      </Styled>
    );
  }
};

export default TriggerOverlay;
