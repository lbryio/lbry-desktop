// @flow
import React from 'react';

type Props = {
  progress: number,
};

class progressBar extends React.PureComponent<Props> {
  static defaultProps = {
    progress: 0,
  };

  render() {
    const { progress } = this.props;
    return (
      <div className="progress-bar">
        <div className="progress-bar__progress" style={{width: progress}}/>
      </div>
    );
  }
}

export default LoadingScreen;
