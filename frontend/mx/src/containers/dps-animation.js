import React, { Component } from 'react';
import styled from 'styled-components';
import StyledButton from 'common/components/styled/button';
import introAnimation from '../videos/dps_animation.mp4';

const INTRO_DELAY = 500; // milliseconds
const TIME_INTRO = 38200; // milliseconds
const OUTRO_DELAY = 1000; // milliseconds

const Styled = styled.div`
  &.intro-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0 6vh;
    height: 100vh;
    opacity: 1;
    transition: opacity 0.6s ease-in 0s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    box-sizing: border-box;
    background-color: white;

    video {
      height: 88vh;
    }

    > div {
      text-align: right;
      width: 100%;
      margin-bottom: 4vh;
    }

    &.fade-out {
      opacity: 0;
    }
  }
`;

class DPSAnimation extends Component {
  animationTimer = null;
  videoEl = null;

  state = {
    fadeOut: true,
  };

  fadeOutAnimation = () => {
    this.setState({ fadeOut: true }, () => {
      setTimeout(() => {
        // Finally, the animation will be completely removed from the DOM
        this.props.onComplete();
      }, OUTRO_DELAY);
    });
  };

  skipAnimation = () => {
    clearTimeout(this.animationTimer);
    this.fadeOutAnimation();
  };

  componentDidMount() {
    setTimeout(() => {
      // Fade in the intro animation
      this.setState({ fadeOut: false }, () => {
        this.videoEl.play();
        this.animationTimer = setTimeout(() => {
          // After a delay, the animation will fade out
          this.fadeOutAnimation();
        }, TIME_INTRO);
      });
    }, INTRO_DELAY);
  }

  render() {
    const { fadeOut } = this.state;
    let classes = 'intro-animation';
    classes = fadeOut ? classes + ' fade-out' : classes;

    return (
      <Styled className={classes}>
        <video
          src={introAnimation}
          preload="auto"
          muted
          ref={el => (this.videoEl = el)}
        />
        <div>
          <StyledButton
            className="next-button large"
            onClick={this.skipAnimation}
          >
            Close
          </StyledButton>
        </div>
      </Styled>
    );
  }
}

export default DPSAnimation;
