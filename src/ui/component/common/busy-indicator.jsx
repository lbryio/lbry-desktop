// @flow
import React from 'react';

type Props = {
  message: ?string,
};

class BusyIndicator extends React.PureComponent<Props> {
  static defaultProps = {
    message: '',
  };

  render() {
    const { message } = this.props;

    return (
      <span className="busy-indicator">
        {message} <span className="busy-indicator__loader" />
      </span>
    );
  }
}

export default BusyIndicator;
