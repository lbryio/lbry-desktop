import * as React from 'react';
import lbry from 'lbry';
import LoadScreen from './internal/load-screen';
import ModalIncompatibleDaemon from 'modal/modalIncompatibleDaemon';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalDownloading from 'modal/modalDownloading';
import * as modals from 'constants/modal_types';

type Props = {
  message: string,
  checkDaemonVersion: () => Promise<any>,
  modal: string,
};

type State = {
  details: string,
  message: string,
  isRunning: boolean,
  isLagging: boolean,
};

export class SplashScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      details: __('Starting daemon'),
      message: __('Connecting'),
      isRunning: false,
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
    if (startupStatus.code == 'started') {
      // Wait until we are able to resolve a name before declaring
      // that we are done.
      // TODO: This is a hack, and the logic should live in the daemon
      // to give us a better sense of when we are actually started
      this.setState({
        message: __('Testing Network'),
        details: __('Waiting for name resolution'),
        isLagging: false,
        isRunning: true,
      });

      lbry.resolve({ uri: 'lbry://one' }).then(() => {
        // Only leave the load screen if the daemon version matched;
        // otherwise we'll notify the user at the end of the load screen.

        if (this.props.daemonVersionMatched) {
          this.props.onReadyToLaunch();
        }
      });
      return;
    }
    if (status.blockchain_status && status.blockchain_status.blocks_behind > 0) {
      const format =
        status.blockchain_status.blocks_behind == 1 ? '%s block behind' : '%s blocks behind';
      this.setState({
        message: __('Blockchain Sync'),
        details: __(format, status.blockchain_status.blocks_behind),
        isLagging: startupStatus.is_lagging,
      });
    } else {
      this.setState({
        message: __('Network Loading'),
        details: startupStatus.message + (startupStatus.is_lagging ? '' : '...'),
        isLagging: startupStatus.is_lagging,
      });
    }
    setTimeout(() => {
      this.updateStatus();
    }, 500);
  }

  componentDidMount() {
    const { checkDaemonVersion } = this.props;

    lbry
      .connect()
      .then(checkDaemonVersion)
      .then(() => {
        this.updateStatus();
      })
      .catch(() => {
        this.setState({
          isLagging: true,
          message: __('Connection Failure'),
          details: __(
            'Try closing all LBRY processes and starting again. If this still happens, your anti-virus software or firewall may be preventing LBRY from connecting. Contact hello@lbry.io if you think this is a software bug.'
          ),
        });
      });
  }

  render() {
    const { modal } = this.props;
    const { message, details, isLagging, isRunning } = this.state;

    return (
      <React.Fragment>
        <LoadScreen message={message} details={details} isWarning={isLagging} />
        {/* Temp hack: don't show any modals on splash screen daemon is running;
            daemon doesn't let you quit during startup, so the "Quit" buttons
            in the modals won't work. */}
        {isRunning && (
          <React.Fragment>
            {modal === modals.INCOMPATIBLE_DAEMON && <ModalIncompatibleDaemon />}
            {modal === modals.UPGRADE && <ModalUpgrade />}
            {modal === modals.DOWNLOADING && <ModalDownloading />}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default SplashScreen;
