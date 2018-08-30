import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ModalComponent from '../components/modal';

const MODAL_ANIMATION_LENGTH = 0.8; // seconds

const ModalContainer = ContentComponent =>
  class extends Component {
    state = {
      isModalLoaded: false,
      isModalVisible: false,
    };

    componentWillReceiveProps({ show }) {
      if (show !== this.props.show) {
        // Prop controlling visibility has changed => modify state accordingly
        if (show) {
          this.showModal();
        } else {
          this.hideModal();
        }
      }
    }

    showModal = () => {
      this.setState({ isModalLoaded: true }, () => {
        setTimeout(() => {
          this.setState({ isModalVisible: true });
        }, 200);
      });
    };

    hideModal = () => {
      this.setState({ isModalVisible: false }, () => {
        setTimeout(() => {
          this.setState({ isModalLoaded: false });
        }, MODAL_ANIMATION_LENGTH * 1000);
      });
    };

    render() {
      const { className, onCancel } = this.props;
      const { isModalLoaded, isModalVisible } = this.state;
      const animationLength = `${MODAL_ANIMATION_LENGTH}s`;

      if (!isModalLoaded) return null;

      return (
        <div style={{ display: 'none' }}>
          {ReactDOM.createPortal(
            <ModalComponent
              className={className}
              isVisible={isModalVisible}
              animationLength={animationLength}
              onCancel={onCancel}
            >
              <ContentComponent {...this.props} />
            </ModalComponent>,
            document.getElementById('modal')
          )}
        </div>
      );
    }
  };

export default ModalContainer;
