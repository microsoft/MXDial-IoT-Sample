import React from 'react';
import styled from 'styled-components';
import Header from 'common/components/header';
import Modal from 'common/containers/modal';
import DeviceDashboard from './device-dashboard';
import Footer from '../containers/footer';
import SetRule from '../containers/set-rule';
import { DEVICE_IMAGE_MAP, DEFAULT_DEVICE_TYPE } from '../common/constants';

const SetRuleModal = Modal(SetRule);

const Styled = styled.div`
  &.mx-demo {
    max-width: 2000px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;

    main {
      flex: 1;
      position: relative;
    }
  }
`;

const App = ({
  numDevices,
  device,
  isThresholdExceeded,
  nextStep,
  onReset,
  step,
  setStep,
  setThreshold,
  trigger,
}) => {
  const imageObj =
    DEVICE_IMAGE_MAP[device.type] || DEVICE_IMAGE_MAP[DEFAULT_DEVICE_TYPE];
  const image = require(`../images/${imageObj.angled}`);

  return (
    <Styled className="mx-demo">
      <Header title="MXChip IoT Demo" />
      <main>
        <DeviceDashboard
          device={device}
          image={image}
          isVisible={!!device}
          step={step}
          trigger={trigger}
          isThresholdExceeded={isThresholdExceeded}
        />
      </main>
      {/* <p> Value is: {value} </p> */}
      <Footer
        numDevices={numDevices}
        step={step}
        onNext={nextStep}
        onReset={onReset}
      />
      <SetRuleModal
        show={step === 3}
        image={image}
        onAccept={(triggerObj, threshold) => {
          setThreshold(triggerObj, threshold);
          nextStep();
        }}
        onCancel={() => setStep(1)}
      />
    </Styled>
  );
};

export default App;
