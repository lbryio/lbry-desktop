// @flow
import type { Status } from 'types/status';
import * as React from 'react';
import * as MODALS from 'constants/modal_types';
import { Lbry } from 'lbry-redux';
import ModalWalletUnlock from 'modal/modalWalletUnlock';
import ModalIncompatibleDaemon from 'modal/modalIncompatibleDaemon';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalDownloading from 'modal/modalDownloading';
import LoadScreen from './internal/load-screen';

const ONE_MINUTE = 60 * 1000;

type Props = {
  checkDaemonVersion: () => Promise<any>,
  notifyUnlockWallet: () => Promise<any>,
  daemonVersionMatched: boolean,
  onReadyToLaunch: () => void,
  authenticate: () => void,
  modal: ?{
    id: string,
  },
};

type State = {
  details: string,
  message: string,
  isRunning: boolean,
  launchedModal: boolean,
  error: boolean,
};

export class SplashScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      details: __('Starting up'),
      message: __('Connecting'),
      isRunning: false,
      launchedModal: false,
      error: false,
    };

    this.hasRecordedUser = false;
    this.timeout = undefined;
  }

  componentDidMount() {
    const { checkDaemonVersion } = this.props;

    this.adjustErrorTimeout();
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

  componentDidUpdate() {
    this.adjustErrorTimeout();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  adjustErrorTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Every time we make it to a new step in the daemon startup process, reset the timer
    // If nothing changes after 1 minute, show the error message.
    this.timeout = setTimeout(() => {
      this.setState({ error: true });
    }, ONE_MINUTE);
  }

  updateStatus() {
    Lbry.status().then(status => {
      this.updateStatusCallback(status);
    });
  }

  updateStatusCallback(status: Status) {
    const { notifyUnlockWallet, authenticate } = this.props;
    const { launchedModal } = this.state;

    if (status.error) {
      this.setState({
        error: true,
      });
      return;
    }

    if (!this.hasRecordedUser && status) {
      authenticate();
      this.hasRecordedUser = true;
    }

    const { wallet, blockchain_headers: blockchainHeaders } = status;

    // If the wallet is locked, stop doing anything and make the user input their password
    if (wallet && wallet.is_locked) {
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
    } else if (blockchainHeaders) {
      const blockChainHeaders = blockchainHeaders;
      if (blockChainHeaders.download_progress < 100) {
        this.setState({
          message: __('Blockchain Sync'),
          details: `${__('Catching up with the blockchain')} (${
            blockchainHeaders.download_progress
          }%)`,
        });
      }
    } else if (wallet && wallet.blocks_behind > 0) {
      const format = wallet.blocks_behind === 1 ? '%s block behind' : '%s blocks behind';
      this.setState({
        message: __('Blockchain Sync'),
        details: __(format, wallet.blocks_behind),
      });
    } else if (wallet && wallet.blocks_behind === 0) {
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
  timeout: ?TimeoutID;

  render() {
    const { modal } = this.props;
    const { message, details, isRunning, error } = this.state;

    const modalId = modal && modal.id;

    return (
      <React.Fragment>
        <LoadScreen message={message} details={details} error={error} />
        {/* Temp hack: don't show any modals on splash screen daemon is running;
            daemon doesn't let you quit during startup, so the "Quit" buttons
            in the modals won't work. */}
        {isRunning && (
          <React.Fragment>
            {modalId === MODALS.WALLET_UNLOCK && <ModalWalletUnlock />}
            {modalId === MODALS.INCOMPATIBLE_DAEMON && <ModalIncompatibleDaemon />}
            {modalId === MODALS.UPGRADE && <ModalUpgrade />}
            {modalId === MODALS.DOWNLOADING && <ModalDownloading />}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default SplashScreen;
