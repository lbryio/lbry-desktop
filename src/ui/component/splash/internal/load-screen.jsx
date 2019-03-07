// @flow
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import Icon from 'component/common/icon';
import Spinner from 'component/spinner';
import Button from 'component/button';

type Props = {
  message: string,
  details: ?string,
  isWarning: boolean,
  error: boolean,
};

class LoadScreen extends React.PureComponent<Props> {
  static defaultProps = {
    isWarning: false,
  };

  render() {
    const { details, message, isWarning, error } = this.props;

    return (
      <div className="load-screen">
        <div>
          <div className="load-screen__header">
            <h1 className="load-screen__title">
              {__('LBRY')}
              <sup>beta</sup>
            </h1>
          </div>
          {error ? (
            <Fragment>
              <h3>{__('Uh oh. Sean must have messed something up. Try refreshing to fix it.')}</h3>
              <div className="load-screen__actions">
                <Button
                  disabled
                  label="Refresh"
                  button="link"
                  className="load-screen__button"
                  onClick={() => window.location.reload()}
                />
              </div>
              <div className="load-screen__help">
                <p>
                  {__(
                    'If you still have issues, your anti-virus software or firewall may be preventing startup.'
                  )}
                </p>
                <p>
                  {__('Reach out to hello@lbry.io for help, or check out')}{' '}
                  <Button
                    button="link"
                    className="load-screen__button"
                    href="https://lbry.io/faq/startup-troubleshooting"
                    label="this link"
                  />
                  .
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              {isWarning ? (
                <span className="load-screen__message">
                  <Icon size={20} icon={ICONS.ALERT} />
                  {` ${message}`}
                </span>
              ) : (
                <div className="load-screen__message">{message}</div>
              )}

              {details && <div className="load-screen__details">{details}</div>}
              <Spinner type="splash" />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default LoadScreen;
