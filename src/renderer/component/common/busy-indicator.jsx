// @flow
import React from 'react';

type Props = {
  message: ?string,
};

const BusyIndicator = (props: Props) => (
  <span className="busy-indicator">
    {props.message} <span className="busy-indicator__loader" />
  </span>
);

export default BusyIndicator;
