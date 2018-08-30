import React, { Component } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import Modal from 'common/containers/modal';
import ResetApp from 'common/components/reset-app';
import StyledButton from 'common/components/styled/button';
import DPSAnimation from './dps-animation';

const ResetAppModal = Modal(ResetApp);

const Styled = styled.div`
  &.footer {
    display: flex;
    justify-content: space-between;
    padding: 0 60px 2.6vw;
    width: 100%;
    box-sizing: border-box;

    button.optional {
      margin-left: 40px;
    }
  }
`;

class Footer extends Component {
  state = {
    isModalVisible: false,
    isAnimationVisible: false,
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  showAnimation = () => {
    this.setState({ isAnimationVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  hideAnimation = () => {
    this.setState({ isAnimationVisible: false });
  };

  resetDemo = () => {
    this.props.onReset();
    this.hideModal();
  };

  render() {
    const { numDevices, step, onNext } = this.props;
    const { isModalVisible, isAnimationVisible } = this.state;

    const notVisible = step === 4;
    const disabled = numDevices === 0 || notVisible;

    const nextButtonClasses = classNames('next-button large', {
      'not-visible': notVisible,
    });

    return (
      <Styled className="footer">
        <div>
          <StyledButton className="large danger" onClick={this.showModal}>
            Reset Demo
          </StyledButton>
          <StyledButton className="large optional" onClick={this.showAnimation}>
            Device Provisioning
          </StyledButton>
        </div>
        <StyledButton
          className={nextButtonClasses}
          disabled={disabled}
          onClick={onNext}
        >
          Next Step
        </StyledButton>
        <ResetAppModal
          className="reset-modal"
          show={isModalVisible}
          onAccept={this.resetDemo}
          onCancel={this.hideModal}
        />
        {isAnimationVisible && (
          <DPSAnimation onComplete={this.hideAnimation} />
        )}
      </Styled>
    );
  }
}

export default Footer;
