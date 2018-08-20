// @flow
import * as React from 'react';
import { Lbry, MODALS } from 'lbry-redux';
import ModalWalletUnlock from 'modal/modalWalletUnlock';
import ModalIncompatibleDaemon from 'modal/modalIncompatibleDaemon';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalDownloading from 'modal/modalDownloading';
import LoadScreen from './internal/load-screen';

type Props = {
  checkDaemonVersion: () => Promise<any>,
  notifyUnlockWallet: () => Promise<any>,
  daemonVersionMatched: boolean,
  onReadyToLaunch: () => void,
  authenticate: () => void,
  notification: ?{
    id: string,
  },
};

type State = {
  details: string,
  message: string,
  isRunning: boolean,
  launchedModal: boolean,
};

export class SplashScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      details: __('Starting up'),
      message: __('Connecting'),
      isRunning: false,
      launchedModal: false,
    };

    this.hasRecordedUser = false;
  }

  componentDidMount() {
    const { checkDaemonVersion } = this.props;

    Lbry.connect()
      .then(checkDaemonVersion)
      .then(() => {
        this.updateStatus();
      })
      .catch(() => {
        this.setState({
          message: __('Connection Failure'),
          details: __(
            'Try closing all LBRY processes and starting again. If this still happens, your anti-virus software or firewall may be preventing LBRY from connecting. Contact hello@lbry.io if you think this is a software bug.'
          ),
        });
      });
  }

  updateStatus() {
    Lbry.status().then(status => {
      this.updateStatusCallback(status);
    });
  }

  updateStatusCallback(status) {
    const { notifyUnlockWallet, authenticate } = this.props;
    const { launchedModal } = this.state;

    if (!this.hasRecordedUser && status) {
      authenticate();
      this.hasRecordedUser = true;
    }

    if (status.wallet && status.wallet.is_locked) {
      this.setState({
        isRunning: true,
      });

      if (launchedModal === false) {
        this.setState({ launchedModal: true }, () => notifyUnlockWallet());
      }
    } else if (status.is_running) {
      // Wait until we are able to resolve a name before declaring
      // that we are done.
      // TODO: This is a hack, and the logic should live in the daemon
      // to give us a better sense of when we are actually started
      this.setState({
        isRunning: true,
      });

      Lbry.resolve({ uri: 'lbry://one' }).then(() => {
        // Only leave the load screen if the daemon version matched;
        // otherwise we'll notify the user at the end of the load screen.

        if (this.props.daemonVersionMatched) {
          this.props.onReadyToLaunch();
        }
      });
      return;
    } else if (status.blockchain_headers && status.blockchain_headers.download_progress < 100) {
      this.setState({
        message: __('Blockchain Sync'),
        details: `${__('Catching up with the blockchain')} (${
          status.blockchain_headers.download_progress
        }%)`,
      });
    } else if (status.wallet && status.wallet.blocks_behind > 0) {
      const format = status.wallet.blocks_behind === 1 ? '%s block behind' : '%s blocks behind';
      this.setState({
        message: __('Blockchain Sync'),
        details: __(format, status.wallet.blocks_behind),
      });
    } else if (status.wallet && status.wallet.blocks_behind === 0) {
      this.setState({
        message: 'Network Loading',
        details: 'Initializing LBRY service...',
      });
    }
    setTimeout(() => {
      this.updateStatus();
    }, 500);
  }

  hasRecordedUser: boolean;

  render() {
    const { notification } = this.props;
    const { message, details, isRunning } = this.state;

    const notificationId = notification && notification.id;

    // {notificationId === MODALS.WALLET_UNLOCK && <ModalWalletUnlock />}
    return (
      <React.Fragment>
        <LoadScreen message={message} details={details} />
        {/* Temp hack: don't show any modals on splash screen daemon is running;
            daemon doesn't let you quit during startup, so the "Quit" buttons
            in the modals won't work. */}
        {isRunning && (
          <React.Fragment>
            {notificationId === MODALS.WALLET_UNLOCK && <ModalWalletUnlock />}
            {notificationId === MODALS.INCOMPATIBLE_DAEMON && <ModalIncompatibleDaemon />}
            {notificationId === MODALS.UPGRADE && <ModalUpgrade />}
            {notificationId === MODALS.DOWNLOADING && <ModalDownloading />}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default SplashScreen;
