import React, { PureComponent } from "react";
import classnames from "classnames";
import { DARK_THEME, LIGHT_THEME } from "constants/themes";

type Props = {
  dark?: boolean; // always a dark spinner,
  light?: boolean; // always a light spinner,
  theme: string;
  type: string | null | undefined;
  delayed: boolean;
  text?: any;
};

type State = {
  show: boolean;
};

class Spinner extends PureComponent<Props, State> {
  static defaultProps = {
    // We may want a dark/light spinner regardless of the current theme
    dark: false,
    light: false,
    delayed: false,
  };

  constructor() {
    // @ts-expect-error - TS2554 - Expected 1-2 arguments, but got 0.
    super();

    this.state = { show: false };
    this.delayedTimeout = null;
  }

  componentDidMount() {
    const { delayed } = this.props;
    if (!delayed) {
      // We can disable this because the default state is to render nothing so there won't be any content thrashing
      this.setState({ show: true });
    } else {
      // If the delayed prop is passed in, wait some time before showing the loading indicator
      // We don't want the spinner to just flash for a fraction of a second
      // @ts-expect-error - TS2322 - Type 'Timeout' is not assignable to type 'number'.
      this.delayedTimeout = setTimeout(() => {
        this.setState({ show: true });
      }, 750);
    }
  }

  componentWillUnmount() {
    if (this.delayedTimeout) {
      clearTimeout(this.delayedTimeout);
      this.delayedTimeout = null;
    }
  }

  delayedTimeout: number | null | undefined;

  render() {
    const { dark, light, theme, type, text } = this.props;
    const { show } = this.state;

    if (!show) {
      return null;
    }

    return (
      <>
        {text}
        <div
          className={classnames("spinner", {
            "spinner--dark": !light && (dark || theme === LIGHT_THEME),
            "spinner--light": !dark && (light || theme === DARK_THEME),
            "spinner--small": type === "small",
          })}
        >
          <div className="rect rect1" />
          <div className="rect rect2" />
          <div className="rect rect3" />
          <div className="rect rect4" />
          <div className="rect rect5" />
        </div>
      </>
    );
  }
}

export default Spinner;
