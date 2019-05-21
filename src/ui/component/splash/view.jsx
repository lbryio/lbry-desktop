// @flow
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
  hideModal: () => void,
  modal: ?{
    id: string,
  },
};

type State = {
  details: string,
  message: string,
  launchedModal: boolean,
  error: boolean,
  isRunning: boolean,
  launchWithIncompatibleDaemon: boolean,
};

export default class SplashScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      details: __('Starting up'),
      message: __('Connecting'),
      launchedModal: false,
      error: false,
      launchWithIncompatibleDaemon: false,
      isRunning: false,
    };

    (this: any).renderModals = this.renderModals.bind(this);
    (this: any).runWithIncompatibleDaemon = this.runWithIncompatibleDaemon.bind(this);
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
            'Try closing all LBRY processes and starting again. If this still happens, your anti-virus software or firewall may be preventing LBRY from connecting. Contact hello@lbry.com if you think this is a software bug.'
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

  updateStatusCallback(status: StatusResponse) {
    const { notifyUnlockWallet, authenticate, modal } = this.props;
    const { launchedModal } = this.state;

    if (status.connection_status.code !== 'connected') {
      this.setState({ error: true });
      return;
    }

    if (!this.hasRecordedUser && status) {
      authenticate();
      this.hasRecordedUser = true;
    }

    const { wallet, blockchain_headers: blockchainHeaders } = status;

    // If the wallet is locked, stop doing anything and make the user input their password
    if (wallet && wallet.is_locked) {
      // Clear the error timeout, it might sit on this step for a while until someone enters their password
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      // Make sure there isn't another active modal (like INCOMPATIBLE_DAEMON)
      if (launchedModal === false && !modal) {
        this.setState({ launchedModal: true }, () => notifyUnlockWallet());
      }
    } else if (status.is_running) {
      // If we cleared the error timout due to a wallet being locked, make sure to start it back up
      if (!this.timeout) {
        this.adjustErrorTimeout();
      }

      Lbry.resolve({ urls: 'lbry://one' }).then(() => {
        this.setState({ isRunning: true }, () => this.continueAppLaunch());
      });

      return;
    } else if (blockchainHeaders) {
      const blockChainHeaders = blockchainHeaders;
      if (blockChainHeaders.download_progress < 100) {
        this.setState({
          message: __('Blockchain Sync'),
          details: `${__('Catching up with the blockchain')} (${blockchainHeaders.download_progress}%)`,
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

  runWithIncompatibleDaemon() {
    const { hideModal } = this.props;
    hideModal();
    this.setState({ launchWithIncompatibleDaemon: true }, () => this.continueAppLaunch());
  }

  continueAppLaunch() {
    const { daemonVersionMatched, onReadyToLaunch } = this.props;
    const { isRunning, launchWithIncompatibleDaemon } = this.state;

    // if (daemonVersionMatched) {
    //   onReadyToLaunch();
    // } else if (launchWithIncompatibleDaemon && isRunning) {
    //   // The user may have decided to run the app with mismatched daemons
    //   // They could make this decision before the daemon is finished starting up
    //   // If it isn't running, this function will be called after the daemon is started
    //   onReadyToLaunch();
    // }
  }

  hasRecordedUser: boolean;
  timeout: ?TimeoutID;

  renderModals() {
    const { modal } = this.props;
    const modalId = modal && modal.id;

    if (!modalId) {
      return null;
    }

    switch (modalId) {
      case MODALS.INCOMPATIBLE_DAEMON:
        return <ModalIncompatibleDaemon onContinueAnyway={this.runWithIncompatibleDaemon} />;
      case MODALS.WALLET_UNLOCK:
        return <ModalWalletUnlock />;
      case MODALS.UPGRADE:
        return <ModalUpgrade />;
      case MODALS.DOWNLOADING:
        return <ModalDownloading />;
      default:
        return null;
    }
  }

  render() {
    const { message, details, error } = this.state;

    return (
      <React.Fragment>
        <LoadScreen message={message} details={details} error={error} />
        {/* Temp hack: don't show any modals on splash screen daemon is running;
            daemon doesn't let you quit during startup, so the "Quit" buttons
            in the modals won't work. */}
        {this.renderModals()}
      </React.Fragment>
    );
  }
}
