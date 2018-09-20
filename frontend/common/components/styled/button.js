import styled from 'styled-components';

const StyledButton = styled.button`
  color: #02a3ee;
  border-style: solid;
  border-color: #02a3ee;
  font-family: SegoeUISemilight, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1;
  border-radius: 8px;
  border-width: 2px;
  opacity: 1;
  transition: opacity 0.6s;

  &.large {
    font-size: 1.875rem;
    width: 21.25rem;
    height: 3.75rem;
    padding-bottom: 0.2rem;
  }

  &.small {
    font-size: 1.125rem;
    font-family: SegoeUISemibold, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 5px 13px;
  }

  &.in-modal {
    font-family: SegoeUISemibold, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 24px;
    text-transform: uppercase;
    width: 180px;
    padding: 6px 0 8px;
  }

  &.danger {
    color: #f16644;
    border-color: #f16644;
  }

  &.optional {
    color: #c7c7c7;
    border-color: #c7c7c7;
  }

  &[disabled] {
    color: #c7c7c7;
    border-color: #c7c7c7;
  }

  &.not-visible {
    opacity: 0;
  }
`;

export default StyledButton;
