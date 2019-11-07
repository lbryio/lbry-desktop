// @flow
import type { Node } from 'react';
import { Lbryio } from 'lbryinc';
import React, { Fragment } from 'react';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import { withRouter } from 'react-router';
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
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { hasError: false };

    (this: any).refresh = this.refresh.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: { stack: string }) {
    let errorMessage = 'Uncaught error\n';

    // @if TARGET='web'
    errorMessage += 'lbry.tv\n';
    errorMessage += window.location.pathname + window.location.search;
    this.log(errorMessage);
    // @endif
    // @if TARGET='app'
    Native.getAppVersionInfo().then(({ localVersion }) => {
      Lbry.version().then(({ lbrynet_version: sdkVersion }) => {
        errorMessage += `app version: ${localVersion}\n`;
        errorMessage += `sdk version: ${sdkVersion}\n`;
        errorMessage += `page: ${window.location.href.split('.html')[1]}\n`;
        errorMessage += `${error.stack}`;
        this.log(errorMessage);
      });
    });
    // @endif
  }

  log(message) {
    declare var app: { env: string };
    if (app.env === 'production') {
      Lbryio.call('event', 'desktop_error', { error_message: message });
    }
  }

  refresh() {
    const { history } = this.props;
    // use history.replace instead of history.push so the user can't click back to the errored page
    history.replace('');
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="main main--empty">
          <Yrbl
            type="sad"
            title={__('Aw shucks!')}
            subtitle={
              <Fragment>
                {__("There was an error. It's been reported and will be fixed")}. {__('Try')}{' '}
                <Button
                  button="link"
                  className="load-screen__button"
                  label={__('refreshing the app')}
                  onClick={this.refresh}
                />{' '}
                {__("to fix it. If that doesn't work, press CMD/CTRL-R to reset to the homepage.")}.
              </Fragment>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
