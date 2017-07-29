import React from "react";
import Router from "component/router";
import Header from "component/header";
import ModalError from "component/modalError";
import ModalDownloading from "component/modalDownloading";
import ModalInsufficientCredits from "component/modalInsufficientCredits";
import ModalUpgrade from "component/modalUpgrade";
import ModalWelcome from "component/modalWelcome";
import ModalFirstReward from "component/modalFirstReward";
import lbry from "lbry";
import * as modals from "constants/modal_types";

class App extends React.PureComponent {
  componentWillMount() {
    const {
      alertError,
      checkUpgradeAvailable,
      updateBalance,
      fetchHotRightNowContent,
    } = this.props;

    document.addEventListener("unhandledError", event => {
      alertError(event.detail);
    });

    if (!this.props.upgradeSkipped) {
      checkUpgradeAvailable();
    }

    lbry.balanceSubscribe(balance => {
      updateBalance(balance);
    });

    fetchHotRightNowContent();

    this.showWelcome(this.props);

    this.scrollListener = () => this.props.recordScroll(window.scrollY);

    window.addEventListener("scroll", this.scrollListener);
  }

  componentWillReceiveProps(nextProps) {
    this.showWelcome(nextProps);
  }

  showWelcome(props) {
    const { isWelcomeAcknowledged, openWelcomeModal, user } = props;

    if (
      !isWelcomeAcknowledged &&
      user &&
      !user.is_reward_approved &&
      !user.is_identity_verified
    ) {
      openWelcomeModal();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
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
        {modal == modals.FIRST_REWARD && <ModalFirstReward />}
      </div>
    );
  }
}

export default App;
