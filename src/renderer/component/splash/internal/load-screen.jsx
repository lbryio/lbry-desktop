// @flow
import * as React from 'react';
import lbry from 'lbry';
import Spinner from 'component/common/spinner';
import Icon from 'component/common/icon';
import * as icons from 'constants/icons';

type Props = {
  message: string,
  details: ?string,
  isWarning: boolean,
};

class LoadScreen extends React.PureComponent<Props> {
  static defaultProps = {
    isWarning: false,
  };

  render() {
    const { details, message, isWarning } = this.props;

    return (
      <div className="load-screen">
        <h1 className="load-screen__title">{__('LBRY')}</h1>
        {isWarning ? (
          <span className="load-screen__message">
            <Icon size={20} icon={icons.ALERT} />
            {` ${message}`}
          </span>
        ) : (
          <div className="load-screen__message">{message}</div>
        )}

        {details && <div className="load-screen__details">{details}</div>}
      </div>
    );
  }
}

export default LoadScreen;
