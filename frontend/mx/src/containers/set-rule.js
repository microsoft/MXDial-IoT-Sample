import React, { Component } from 'react';
import styled from 'styled-components';
import RadioButton from '../icons/radio-button';
import { TRIGGERS } from '../common/constants';

const Styled = styled.div`
  &.set-rule {
    padding: 6% 10% 6.5%;
    text-align: center;

    > img {
      width: 60%;
      display: block;
      margin: 0 auto;
      max-width: 220px;
    }

    > b {
      color: #727272;
      font-size: 1.125rem;
      font-weight: normal;
      margin: 0;
    }

    h1 {
      color: #02a3ee;
      font-size: 2.25rem;
      font-weight: normal;
      margin: 1rem 0 1.25rem;
      font-family: SegoeUISemilight, 'Helvetica Neue', Helvetica, Arial,
        sans-serif;
    }

    form {
      .trigger-selector {
        margin-bottom: 2.2rem;

        b {
          display: block;
          color: #000000;
          font-size: 1.125rem;
          text-align: center;
          margin-bottom: 1.2rem;
        }
        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;

          label {
            display: flex;
            flex-direction: column;
            align-items: center;

            input {
              visibility: hidden;
              position: absolute;
            }

            .radio-button {
              width: 24px;
              transform: scale(0.9);
              transition: transform 0.4s;
            }

            span {
              font-size: 0.875rem;
              text-transform: capitalize;
            }

            &:hover {
              cursor: pointer;

              .radio-button {
                transform: scale(1.1);
              }
            }
          }
        }
      }

      .threshold {
        display: flex;
        justify-content: center;

        label {
          span {
            display: block;
            color: #000000;
            font-size: 1.125rem;
            text-align: center;
            font-weight: bold;
          }

          input[type='text'] {
            font-size: 1.125rem;
            color: #757575;
            width: 15rem;
            border-width: 0 0 1px 0;
            border-style: solid;
            border-color: #c7c7c7;
            padding: 0.75rem 0;
            text-align: center;
          }
        }
      }

      input[type='submit'] {
        color: #02a3ee;
        border: 2px solid #02a3ee;
        border-radius: 8px;
        margin-top: 12%;
        font-family: SegoeUISemibold, 'Helvetica Neue', Helvetica, Arial,
          sans-serif;
        font-size: 24px;
        text-transform: uppercase;
        width: 180px;
        padding: 4px 0;
        background-color: transparent;
        opacity: 1;
        transition: opacity 0.6s;

        &[disabled] {
          opacity: 0.6;
        }
      }
    }
  }
`;

class SetRule extends Component {
  state = {
    selectedTrigger: TRIGGERS[0],
    thresholdValue: '',
  };

  updateThreshold = event => {
    const field = event.target.name;
    let newValue = event.target.value;
    // Strip all characters from the input except digits
    newValue = newValue.replace(/\D/g, '');
    this.setState({ [field]: newValue });
  };

  updateTrigger = triggerObj => {
    this.setState({ selectedTrigger: triggerObj });
  };

  submitForm = event => {
    event.preventDefault();
    const { selectedTrigger, thresholdValue } = this.state;
    const threshold = parseInt(thresholdValue, 10);
    if (!isNaN(threshold)) {
      this.setState({ thresholdValue: '' });
      this.props.onAccept(selectedTrigger, threshold);
    }
  };

  render() {
    const { image, caption } = this.props;
    const { thresholdValue, selectedTrigger } = this.state;
    const isSubmittable = thresholdValue;

    return (
      <Styled className="set-rule">
        <img src={image} alt="" />
        {caption && <b>{caption}</b>}
        <form autoComplete="off" onSubmit={this.submitForm}>
          <h1>Rules engine</h1>

          <div className="trigger-selector">
            <b>Select trigger</b>
            <div>
              {TRIGGERS.map(trigger => (
                <label key={trigger.name}>
                  <input
                    type="radio"
                    name="trigger"
                    value={trigger.name}
                    checked={selectedTrigger.name === trigger.name}
                    onChange={() => this.updateTrigger(trigger)}
                  />
                  <RadioButton
                    selected={selectedTrigger.name === trigger.name}
                  />
                  <span>{trigger.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="threshold">
            <label>
              <span>{selectedTrigger.label}</span>
              <input
                type="text"
                name="thresholdValue"
                value={thresholdValue}
                onChange={this.updateThreshold}
                maxLength="3"
              />
            </label>
          </div>

          <input
            className="in-modal"
            type="submit"
            disabled={!isSubmittable}
            value="Set Rule"
          />
        </form>
      </Styled>
    );
  }
}

export default SetRule;
