// @flow
import React from 'react';
import Spinner from 'component/spinner';

type Props = {
  status: string,
  spinner: boolean,
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
        {status && <span className="content__loading-text">{status}</span>}
      </div>
    );
  }
}

export default LoadingScreen;
