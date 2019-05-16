// @flow
import { Lbryio } from 'lbryinc';
import * as React from 'react';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import { withRouter } from 'react-router';

type Props = {
  children: React.Node,
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
    declare var app: { env: string };

    const errorMessage = `
    ${window.location.pathname + window.location.search}\n
    ${error.stack}
    `;

    if (app.env === 'production') {
      Lbryio.call('event', 'desktop_error', { error_message: errorMessage });
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
        <div className="load-screen">
          <Yrbl
            type="sad"
            title={__('Aw shucks!')}
            subtitle={
              <div>
                <p>
                  {__("There was an error. It's been reported and will be fixed")}. {__('Try')}{' '}
                  <Button
                    button="link"
                    className="load-screen__button"
                    label={__('refreshing the app')}
                    onClick={this.refresh}
                  />{' '}
                  {__('to fix it')}.
                </p>
              </div>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
