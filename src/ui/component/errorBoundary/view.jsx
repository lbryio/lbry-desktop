// @flow
import { Lbryio } from 'lbryinc';
import * as React from 'react';
import Yrbl from 'component/yrbl';
import Button from 'component/button';

type Props = {
  children: React.Node,
};

type State = {
  hasError: boolean,
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { hasError: false };
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
      Lbryio.call('event', 'desktop_error', { error_message: error.stack });
    }
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
                    onClick={() => (window.location.href = '/')}
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
