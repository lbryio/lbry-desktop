import React from "react";
import lbry from "../lbry.js";
import LoadScreen from "./load_screen.js";

export class SplashScreen extends React.PureComponent {
  static propTypes = {
    message: React.PropTypes.string,
    onLoadDone: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      details: __("Starting daemon"),
      message: __("Connecting"),
      isLagging: false,
    };
  }

  updateStatus() {
    lbry.status().then(status => {
      this._updateStatusCallback(status);
    });
  }

  _updateStatusCallback(status) {
    const startupStatus = status.startup_status;
    if (startupStatus.code == "started") {
      // Wait until we are able to resolve a name before declaring
      // that we are done.
      // TODO: This is a hack, and the logic should live in the daemon
      // to give us a better sense of when we are actually started
      this.setState({
        message: __("Testing Network"),
        details: __("Waiting for name resolution"),
        isLagging: false,
      });

      lbry.resolve({ uri: "lbry://one" }).then(() => {
        this.props.onLoadDone();
      });
      return;
    }
    this.setState({
      details: startupStatus.message + (startupStatus.is_lagging ? "" : "..."),
      isLagging: startupStatus.is_lagging,
    });
    setTimeout(() => {
      this.updateStatus();
    }, 500);
  }

  componentDidMount() {
    lbry
      .connect()
      .then(() => {
        this.updateStatus();
      })
      .catch(() => {
        this.setState({
          isLagging: true,
          message: __("Connection Failure"),
          details: __(
            "Try closing all LBRY processes and starting again. If this still happens, your anti-virus software or firewall may be preventing LBRY from connecting. Contact hello@lbry.io if you think this is a software bug."
          ),
        });
      });
  }

  render() {
    return (
      <LoadScreen
        message={this.state.message}
        details={this.state.details}
        isWarning={this.state.isLagging}
      />
    );
  }
}

export default SplashScreen;
