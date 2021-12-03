// @flow
import type { Node } from 'react';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Lbry from 'lbry';
import Button from 'component/button';
import ModalWalletUnlock from 'modal/modalWalletUnlock';
import ModalIncompatibleDaemon from 'modal/modalIncompatibleDaemon';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalDownloading from 'modal/modalDownloading';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import 'css-doodle';

const FORTY_FIVE_SECONDS = 45 * 1000;
const UPDATE_INTERVAL = 1000; // 1 second
const MAX_WALLET_WAIT = 20; // 20 seconds for wallet to be started, but servers to be unavailable
const MAX_SYNC_WAIT = 45; // 45 seconds to sync wallet, show message if taking long

type Props = {
  checkDaemonVersion: () => Promise<any>,
  notifyUnlockWallet: (?boolean) => Promise<any>,
  daemonVersionMatched: boolean,
  onReadyToLaunch: () => void,
  hideModal: () => void,
  modal: ?{
    id: string,
  },
  animationHidden: boolean,
  toggleSplashAnimation: () => void,
  clearWalletServers: () => void,
  doShowSnackBar: (string) => void,
};

type State = {
  details: string | Node,
  message: string,
  launchedModal: boolean,
  error: boolean,
  isRunning: boolean,
  launchWithIncompatibleDaemon: boolean,
  waitingForWallet: number,
  waitingForSync: number,
};

export default class SplashScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      details: __('Starting...'),
      message: __('Connecting'),
      launchedModal: false,
      error: false,
      launchWithIncompatibleDaemon: !process.env.NODE_ENV === 'production',
      isRunning: false,
      waitingForWallet: 0,
      waitingForSync: 0,
    };

    (this: any).renderModals = this.renderModals.bind(this);
    (this: any).runWithIncompatibleDaemon = this.runWithIncompatibleDaemon.bind(this);
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
    }, FORTY_FIVE_SECONDS);
  }

  updateStatus() {
    const { modal, notifyUnlockWallet, clearWalletServers, doShowSnackBar } = this.props;
    const { launchedModal } = this.state;

    Lbry.status().then((status) => {
      const sdkStatus = status;
      const { wallet } = status;
      Lbry.wallet_status().then((walletStatus) => {
        if (sdkStatus.is_running && wallet && wallet.available_servers) {
          if (walletStatus.is_locked) {
            // Clear the error timeout, it might sit on this step for a while until someone enters their password
            if (this.timeout) {
              clearTimeout(this.timeout);
            }
            // Make sure there isn't another active modal (like INCOMPATIBLE_DAEMON)
            this.updateStatusCallback(sdkStatus, walletStatus, true);
            if (launchedModal === false && !modal) {
              this.setState({ launchedModal: true }, () => notifyUnlockWallet());
            }
          } else {
            this.updateStatusCallback(sdkStatus, walletStatus);
          }
        } else if (!sdkStatus.is_running && walletStatus.is_syncing) {
          // Clear the timeout if wallet is still syncing
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.updateStatusCallback(sdkStatus, walletStatus);
        } else if (this.state.waitingForWallet > MAX_WALLET_WAIT && launchedModal === false && !modal) {
          clearWalletServers();
          doShowSnackBar(
            __(
              'The wallet server took a bit too long. Resetting defaults just in case. Shutdown (Cmd/Ctrl+Q) LBRY and restart if this continues.'
            )
          );
          this.setState({ waitingForWallet: 0 });
          this.updateStatusCallback(sdkStatus, walletStatus);
        } else {
          this.updateStatusCallback(sdkStatus, walletStatus);
        }
      });
    });
  }

  updateStatusCallback(status: StatusResponse, walletStatus: WalletStatusResponse, waitingForUnlock: boolean = false) {
    const { wallet, startup_status: startupStatus } = status;

    // If the wallet is locked, stop doing anything and make the user input their password
    if (startupStatus && wallet && wallet.available_servers < 1) {
      this.setState({ waitingForWallet: this.state.waitingForWallet + UPDATE_INTERVAL / 1000 });
    } else if (status.is_running && !waitingForUnlock) {
      Lbry.resolve({ urls: 'lbry://one' }).then(() => {
        this.setState({ isRunning: true }, () => this.continueAppLaunch());
      });

      return;
    } else if (wallet && !status.is_running && walletStatus.is_syncing) {
      this.setState({ waitingForSync: this.state.waitingForSync + UPDATE_INTERVAL / 1000 });
      if (this.state.waitingForSync < MAX_SYNC_WAIT) {
        this.setState({
          message: __('Loading Wallet'),
          details: __('Updating wallet data...'),
        });
      } else {
        this.setState({
          message: __('Loading Wallet'),
          details: (
            <React.Fragment>
              <div>{__('Large account history')}</div>
              <div>{__('Please wait...')}</div>
            </React.Fragment>
          ),
        });
      }
    } else if (wallet && !status.is_running && startupStatus.database) {
      this.setState({
        message: __('Finalizing'),
        details: __('Almost ready...'),
      });
    }

    setTimeout(() => {
      this.updateStatus();
    }, UPDATE_INTERVAL);
  }

  runWithIncompatibleDaemon() {
    const { hideModal } = this.props;
    hideModal();
    this.setState({ launchWithIncompatibleDaemon: true }, () => this.continueAppLaunch());
  }

  continueAppLaunch() {
    const { daemonVersionMatched, onReadyToLaunch } = this.props;
    const { isRunning, launchWithIncompatibleDaemon } = this.state;

    if (daemonVersionMatched) {
      onReadyToLaunch();
    } else if (launchWithIncompatibleDaemon && isRunning) {
      // The user may have decided to run the app with mismatched daemons
      // They could make this decision before the daemon is finished starting up
      // If it isn't running, this function will be called after the daemon is started
      onReadyToLaunch();
    }
  }

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
    const { error, details } = this.state;
    const { animationHidden, toggleSplashAnimation } = this.props;

    return (
      <div className="splash">
        <h1 className="splash__title">LBRY</h1>
        <div className="splash__details">{details}</div>

        {!animationHidden && !error && (
          <css-doodle class="doodle">
            {`
            --color: @p(var(--color-primary), var(--color-secondary), var(--color-focus), var(--color-nothing));
            :doodle {
              @grid: 30x1 / 18vmin;
              --deg: @p(-180deg, 180deg);
            }
            :container {
              perspective: 30vmin;
            }

            @place-cell: center;
            @size: 100%;

            box-shadow: @m2(0 0 50px var(--color));
            will-change: transform, opacity;
            animation: scale-up 12s linear infinite;
            animation-delay: calc(-12s / @size() * @i());

            @keyframes scale-up {
              0%, 95.01%, 100% {
                transform: translateZ(0) rotate(0);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              95% {
                transform:
                  translateZ(35vmin) rotateZ(@var(--deg));
              }
            }
          )
          `}
          </css-doodle>
        )}
        {!error && (
          <Button
            className="splash__animation-toggle"
            label={!animationHidden ? __('I feel woosy! Stop spinning!') : __('Spin Spin Sugar')}
            onClick={() => toggleSplashAnimation()}
          />
        )}
        {error && (
          <Card
            title={__('Error starting up')}
            subtitle={
              <React.Fragment>
                <p>
                  {__(
                    'You can try refreshing to fix it. If you still have issues, your anti-virus software or firewall may be preventing startup.'
                  )}
                </p>
                <p>
                  <I18nMessage
                    tokens={{
                      help_link: (
                        <Button
                          button="link"
                          href="https://lbry.com/faq/startup-troubleshooting"
                          label={__('this link')}
                        />
                      ),
                    }}
                  >
                    Reach out to hello@lbry.com for help, or check out %help_link%.
                  </I18nMessage>
                </p>
              </React.Fragment>
            }
            actions={
              <Button
                button="primary"
                icon={ICONS.REFRESH}
                label={__('Refresh')}
                onClick={() => window.location.reload()}
              />
            }
          />
        )}
        {/* Temp hack: don't show any modals on splash screen daemon is running;
            daemon doesn't let you quit during startup, so the "Quit" buttons
          in the modals won't work. */}
        {this.renderModals()}
      </div>
    );
  }
}
