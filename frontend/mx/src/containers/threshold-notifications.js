import { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class ThresholdNotifications extends Component {
  twitterAPI = `${process.env.REACT_APP_MX_API}/api/mx/tweet`;

  getNotificationMessage = () => {
    const { deviceId, trigger: { message }, thresholdValue } = this.props;
    const time = moment()
      .utc()
      .format('h:mm A');
    return `Device ${deviceId} exceeded the ${
      message.threshold
    } threshold of ${thresholdValue}${message.unit} at ${time} UTC`;
  };

  componentWillReceiveProps({ isThresholdExceeded }) {
    const { trigger, thresholdValue } = this.props;

    if (
      trigger &&
      thresholdValue &&
      isThresholdExceeded &&
      isThresholdExceeded !== this.props.isThresholdExceeded
    ) {
      const message = this.getNotificationMessage();
      axios({
        crossDomain: true,
        method: 'POST',
        url: this.twitterAPI,
        data: {
          messageContents: message,
        },
      })
        .then(() => {
          console.log('Message sent: ', message); // eslint-disable-line
        })
        .catch(e => {
          if (process.env.NODE_ENV !== 'production') {
            console.error(e);
            console.log('Failed to send notification message: ', message); // eslint-disable-line
          }
        });
    }
  }
  render() {
    return this.props.children;
  }
}

export default ThresholdNotifications;
