// @flow
import type { Node } from 'react';
import React from 'react';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import { withRouter } from 'react-router';
import analytics from 'analytics';
import I18nMessage from 'component/i18nMessage';
import Native from 'native';
import { Lbry } from 'lbry-redux';

type Props = {
  children: Node,
  history: {
    replace: string => void,
  },
};

type State = {
  hasError: boolean,
  eventId: ?string,
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { hasError: false, eventId: undefined };

    (this: any).refresh = this.refresh.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // analytics.error(error, errorInfo).then(eventId => {
    //   this.setState({ eventId });
    // });
    let errorMessage = 'Uncaught error\n';

    // @if TARGET='web'
    errorMessage += 'lbry.tv\n';
    errorMessage += `page: ${window.location.pathname + window.location.search}\n`;
    errorMessage += error.stack;
    analytics.error(errorMessage);

    // @endif
    // @if TARGET='app'
    Native.getAppVersionInfo().then(({ localVersion }) => {
      Lbry.version().then(({ lbrynet_version: sdkVersion }) => {
        errorMessage += `app version: ${localVersion}\n`;
        errorMessage += `sdk version: ${sdkVersion}\n`;
        errorMessage += `page: ${window.location.href.split('.html')[1]}\n`;
        errorMessage += `${error.stack}`;
        analytics.error(errorMessage);
      });
    });
    // @endif
  }

  refresh() {
    const { history } = this.props;

    // use history.replace instead of history.push so the user can't click back to the errored page
    history.replace('');
    this.setState({ hasError: false });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className="main main--empty">
          <Yrbl
            type="sad"
            title={__('Aw shucks!')}
            subtitle={
              <I18nMessage
                tokens={{
                  refreshing_the_app_link: (
                    <Button
                      button="link"
                      className="load-screen__button"
                      label={__('refreshing the app')}
                      onClick={this.refresh}
                    />
                  ),
                }}
              >
                There was an error. Try %refreshing_the_app_link% to fix it. If that doesn't work, try pressing
                Ctrl+R/Cmd+R.
              </I18nMessage>
            }
          />
          {/* {eventId === null && (
            <div className="error-wrapper">
              <span className="error-text">
                {__('You are not currently sharing diagnostic data so this error was not reported.')}
              </span>
            </div>
          )}
          {eventId && (
            <div className="error-wrapper">
              <span className="error-text">{__('Error ID: %eventId%', { eventId })}</span>
            </div>
          )} */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
