import React, { Component } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

const MAX_RETRY_ATTEMPTS = 3;
const ERROR_MESSAGE_DELAY = 3000; // Milliseconds before hiding error message

const Styled = styled.div`
  &.send-message {
    width: 720px;
    margin: 0 auto;
    text-align: center;

    label {
      position: relative;
      display: block;
      width: 100%;
      height: 3.75rem;
      color: #c7c7c7;
      font-family: SegoeUISemilight, 'Helvetica Neue', Helvetica, Arial,
        sans-serif;
      font-size: 2.25rem;
      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: #c7c7c7;
      overflow: hidden;

      input[type='text'] {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: inherit;
        text-align: center;
        border: 0 none;

        &:focus + span {
          transform: translateY(60px) !important;
        }
      }

      span {
        position: absolute;
        top: 0;
        left: 0;
        width: inherit;
        transform: translateY(60px);
        transition: transform 0.2s ease-out;

        &.error {
          color: #f16644;
          font-style: italic;
        }
      }
    }

    input[type='submit'] {
      color: #02a3ee;
      border: 2px solid #02a3ee;
      border-radius: 8px;
      margin-top: 2.2rem;
      font-family: SegoeUISemilight, 'Helvetica Neue', Helvetica, Arial,
        sans-serif;
      font-size: 1.875rem;
      padding: 0.75rem 138px 0.94rem;
      background-color: transparent;
      line-height: 1;

      &[disabled] {
        opacity: 0.6;
      }
    }

    &.empty {
      label input[type='text'] + span {
        transform: translateY(0);
      }
    }
  }
`;

class SendMessage extends Component {
  attempts = 1;
  state = {
    message: '',
    isErrorMessageVisible: false,
    isSendingMessage: false,
  };

  updateForm = event => {
    const field = event.target.name;
    const newValue = event.target.value;
    this.setState({ [field]: newValue });
  };

  sendMessage = message => {
    this.props
      .onSend(message)
      .then(() => {
        // Clear message on successful send
        this.setState({ message: '', isSendingMessage: false });
      })
      .catch(e => {
        this.attempts++;
        if (this.attempts > MAX_RETRY_ATTEMPTS) {
          // Make error message visible
          this.setState({ isErrorMessageVisible: true }, () => {
            this.attempts = 1;
            setTimeout(() => {
              // Hide error message
              this.setState({
                isErrorMessageVisible: false,
                isSendingMessage: false,
              });
            }, ERROR_MESSAGE_DELAY);
          });
        } else {
          this.sendMessage(message);
        }
      });
  };

  submitForm = event => {
    event.preventDefault();
    const { message } = this.state;
    if (message) {
      this.setState({ isSendingMessage: true });
      this.sendMessage(message);
    }
  };

  render() {
    const { className } = this.props;
    const { message, isErrorMessageVisible, isSendingMessage } = this.state;
    const inputValue = isErrorMessageVisible ? '' : message;
    const classes = classNames('send-message', className, {
      empty: inputValue === '',
    });

    return (
      <Styled className={classes}>
        <form autoComplete="off" onSubmit={this.submitForm}>
          <label>
            <input
              type="text"
              name="message"
              value={inputValue}
              onChange={this.updateForm}
              maxLength="14"
              disabled={isSendingMessage}
            />
            {isErrorMessageVisible || message !== '' ? (
              <span className="error">Message not sent. Please try again.</span>
            ) : (
              <span>Type your message here</span>
            )}
          </label>
          <input type="submit" disabled={isSendingMessage} value="Send" />
        </form>
      </Styled>
    );
  }
}

export default SendMessage;
