import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Store from './app/store';
import DeviceProvider from './containers/device-provider';
import App from './containers/app';

import 'common/styles/normalize.css';
import 'common/styles/fonts.css';
import 'common/styles/base.css';

ReactDOM.render(
  <DeviceProvider>
    {(deviceId) => (
      <Provider store={Store.configure()}>
        <App deviceId={deviceId} />
      </Provider>
    )}
  </DeviceProvider>, document.getElementById('root'));
