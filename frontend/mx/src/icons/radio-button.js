import React from 'react';
import styled from 'styled-components';

const Styled = styled.g`
  &.icon {
    path {
      fill: #959595;
    }

    &.selected {
      path, circle {
        fill: #4597E9;
      }
    }
    &.unselected {
      circle {
        fill: transparent;
      }
    }
  }
`;

const RadioButton = props => {
  const selectedClass = props.selected ? 'selected' : 'unselected';
  const classes = `icon ${selectedClass}`
  return (
    <svg className="radio-button" viewBox="0 0 18 18">
      <Styled className={classes}>
        <path d="M9,16c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S12.9,16,9,16z M9,2.9C5.6,2.9,2.9,5.6,2.9,9s2.8,6.1,6.1,6.1
      			s6.1-2.8,6.1-6.1S12.4,2.9,9,2.9z" />
        <circle cx="9" cy="9" r="4" />
      </Styled>
    </svg>
  );
}

export default RadioButton;
