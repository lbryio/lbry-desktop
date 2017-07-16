import React from "react";
import Router from "component/router";
import Header from "component/header";
import ModalError from "component/modalError";
import ModalDownloading from "component/modalDownloading";
import ModalInsufficientCredits from "component/modalInsufficientCredits";
import ModalUpgrade from "component/modalUpgrade";
import ModalWelcome from "component/modalWelcome";
import lbry from "lbry";
import * as modals from "constants/modal_types";

class App extends React.PureComponent {
  componentWillMount() {
    const { alertError, checkUpgradeAvailable, updateBalance } = this.props;

    document.addEventListener("unhandledError", event => {
      alertError(event.detail);
    });

    if (!this.props.upgradeSkipped) {
      checkUpgradeAvailable();
    }

    lbry.balanceSubscribe(balance => {
      updateBalance(balance);
    });

    this.showWelcome(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.showWelcome(nextProps);
  }

  showWelcome(props) {
    const {
      isFetchingRewards,
      isWelcomeAcknowledged,
      isWelcomeRewardClaimed,
      openWelcomeModal,
      user,
    } = props;

    if (
      !isWelcomeAcknowledged &&
      user &&
      (!isFetchingRewards || !isWelcomeRewardClaimed)
    ) {
      openWelcomeModal();
    }
  }

  render() {
    const { modal } = this.props;

    return (
      <div id="window">
        <Header />
        <div id="main-content">
          <Router />
        </div>
        {modal == modals.UPGRADE && <ModalUpgrade />}
        {modal == modals.DOWNLOADING && <ModalDownloading />}
        {modal == modals.ERROR && <ModalError />}
        {modal == modals.INSUFFICIENT_CREDITS && <ModalInsufficientCredits />}
        {modal == modals.WELCOME && <ModalWelcome />}
      </div>
    );
  }
}

export default App;
