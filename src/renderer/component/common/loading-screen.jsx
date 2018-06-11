// @flow
import React from 'react';
import Spinner from 'component/spinner';
import ProgressBar from 'component/common/progress-bar';

type Props = {
  status: string,
  spinner: boolean,
  progress?: number,
};

class LoadingScreen extends React.PureComponent<Props> {
  static defaultProps = {
    spinner: true,
  };

  render() {
    const { status, spinner } = this.props;
    return (
      <div className="content__loading">
        {spinner && <Spinner light />}
        {progress && <ProgressBar progress={progress}/>}
        {status && <span className="content__loading-text">{status}</span>}
      </div>
    );
  }
}

export default LoadingScreen;
