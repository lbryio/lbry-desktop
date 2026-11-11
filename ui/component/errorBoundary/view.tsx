import type { ReactNode } from "react";
import React from "react";
import Yrbl from "component/yrbl";
import Button from "component/button";
import { withRouter } from "react-router";
import analytics from "analytics";
import I18nMessage from "component/i18nMessage";
import Native from "native";
import Lbry from "lbry";

type Props = {
  children: React.ReactNode;
  history: {
    replace: (arg1: string) => void;
  };
};

type State = {
  hasError: boolean;
  sentryEventId: string | null | undefined;
  desktopErrorReported: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor() {
    // @ts-expect-error - TS2554 - Expected 1-2 arguments, but got 0.
    super();
    this.state = { hasError: false, sentryEventId: undefined, desktopErrorReported: false };

    (this as any).refresh = this.refresh.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // @if TARGET='app'
    let errorMessage = "Uncaught error\n";
    Native.getAppVersionInfo().then(({ localVersion }) => {
      Lbry.version().then(({ lbrynet_version: sdkVersion }) => {
        errorMessage += `app version: ${localVersion}\n`;
        errorMessage += `sdk version: ${sdkVersion}\n`;
        errorMessage += `page: ${window.location.href.split(".html")[1]}\n`;
        // @ts-expect-error - TS2339 - Property 'stack' does not exist on type 'unknown'.
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
    history.replace("");
    this.setState({ hasError: false });
  }

  render() {
    const { hasError } = this.state;
    const { desktopErrorReported } = this.state;

    const errorWasReported = desktopErrorReported;

    if (hasError) {
      return (
        <div className="main main--full-width main--empty">
          <Yrbl
            type="sad"
            title={__("Aw shucks!")}
            subtitle={
              // @ts-expect-error - TS2745 (ts-migration)
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
                tokens={{
                  refreshing_the_app_link: (
                    <Button
                      // @ts-expect-error - TS2322 (ts-migration)
                      button="link"
                      className="load-screen__button"
                      label={__("refreshing the app")}
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
                {__("You are not currently sharing diagnostic data so this error was not reported.")}
              </span>
            </div>
          )}

          {errorWasReported && (
            <div className="error__wrapper">
              {/* @if TARGET='app' */}
              <span className="error__text">{__("This error was reported and will be fixed.")}</span>
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
