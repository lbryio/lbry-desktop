// @flow
import React from 'react';
import classnames from 'classnames';
import Spinner from 'component/spinner';

type Props = {
  status?: string,
  spinner: boolean,
  isDocument: boolean,
};

class LoadingScreen extends React.PureComponent<Props> {
  static defaultProps = {
    spinner: true,
    isDocument: false,
  };

  render() {
    const { status, spinner, isDocument } = this.props;
    return (
      <div className={classnames('content__loading', { 'content__loading--document': isDocument })}>
        {spinner && (
          <Spinner
            light={!isDocument}
            delayed
            text={status && <span className={classnames('content__loading-text')}>{status}</span>}
          />
        )}
      </div>
    );
  }
}

export default LoadingScreen;
