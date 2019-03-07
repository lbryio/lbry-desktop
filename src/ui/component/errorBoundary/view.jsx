// @flow
import * as React from 'react';
import Yrbl from 'component/yrbl';
import Button from 'component/button';

const WEB_HOOK_URL =
  'https://hooks.slack.com/services/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';

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

    if (app.env === 'production') {
      fetch(WEB_HOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          text: error.stack,
        }),
      });
    }
  }

  render() {
    if (!this.state.hasError) {
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
                    onClick={() => window.location.reload()}
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
