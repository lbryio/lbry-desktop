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
    document.addEventListener("unhandledError", event => {
      this.props.alertError(event.detail);
    });

    if (!this.props.upgradeSkipped) {
      this.props.checkUpgradeAvailable();
    }

    lbry.balanceSubscribe(balance => {
      this.props.updateBalance(balance);
    });
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
