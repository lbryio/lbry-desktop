// @flow
import React from 'react';
import Spinner from 'component/common/spinner';

type Props = {
  spinner: boolean,
  status: string,
};

class LoadingScreen extends React.PureComponent<Props> {
  static defaultProps = {
    spinner: true,
  };

  render() {
    const { status, spinner } = this.props;
    return (
      <div className="content__loading">
        {spinner && <Spinner />}

        <span className="content__loading-text">{status}</span>
      </div>
    );
  }
}

export default LoadingScreen;
