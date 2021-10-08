// @flow
import type { Node } from 'react';
import React from 'react';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import { withRouter } from 'react-router';
import analytics from 'analytics';
import I18nMessage from 'component/i18nMessage';
import Native from 'native';
import Lbry from 'lbry';

type Props = {
  children: Node,
  history: {
    replace: (string) => void,
  },
};

type State = {
  hasError: boolean,
  sentryEventId: ?string,
  desktopErrorReported: boolean,
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { hasError: false, sentryEventId: undefined, desktopErrorReported: false };

    (this: any).refresh = this.refresh.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // @if TARGET='web'
    analytics.sentryError(error, errorInfo).then((sentryEventId) => {
      this.setState({ sentryEventId });
    });
    // @endif

    // @if TARGET='app'
    let errorMessage = 'Uncaught error\n';
    Native.getAppVersionInfo().then(({ localVersion }) => {
      Lbry.version().then(({ lbrynet_version: sdkVersion }) => {
        errorMessage += `app version: ${localVersion}\n`;
        errorMessage += `sdk version: ${sdkVersion}\n`;
        errorMessage += `page: ${window.location.href.split('.html')[1]}\n`;
        errorMessage += `${error.stack}`;
        analytics.error(errorMessage).then((isSharingData) => {
          this.setState({ desktopErrorReported: isSharingData });
        });
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
    const { sentryEventId, desktopErrorReported } = this.state;

    const errorWasReported = IS_WEB ? sentryEventId !== null : desktopErrorReported;

    if (hasError) {
      return (
        <div className="main main--full-width main--empty">
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
          {!errorWasReported && (
            <div className="error__wrapper">
              <span className="error__text">
                {__('You are not currently sharing diagnostic data so this error was not reported.')}
              </span>
            </div>
          )}

          {errorWasReported && (
            <div className="error__wrapper">
              {/* @if TARGET='web' */}
              <span className="error__text">{__('Error ID: %sentryEventId%', { sentryEventId })}</span>
              {/* @endif */}
              {/* @if TARGET='app' */}
              <span className="error__text">{__('This error was reported and will be fixed.')}</span>
              {/* @endif */}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
