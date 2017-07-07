import React from "react";
import Router from "component/router";
import Header from "component/header";
import ModalError from "component/modalError";
import ModalDownloading from "component/modalDownloading";
import ModalUpgrade from "component/modalUpgrade";
import IncompatibleDaemonModal from "component/incompatibleDaemonModal";
import ModalWelcome from "component/modalWelcome";
import lbry from "lbry";
import { Line } from "rc-progress";

class App extends React.PureComponent {
  componentWillMount() {
    document.addEventListener("unhandledError", event => {
      this.props.alertError(event.detail);
    });

    if (!this.props.upgradeSkipped) {
      this.props.checkUpgradeAvailable();
    }

    this.props.checkDaemonVersion();

    lbry.balanceSubscribe(balance => {
      this.props.updateBalance(balance);
    });

    this.scrollListener = () => this.props.recordScroll(window.scrollY);

    window.addEventListener("scroll", this.scrollListener);
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
        {modal == "incompatibleDaemon" && <IncompatibleDaemonModal />}
        {modal == "upgrade" && <ModalUpgrade />}
        {modal == "downloading" && <ModalDownloading />}
        {modal == "error" && <ModalError />}
        {modal == "welcome" && <ModalWelcome />}
      </div>
    );
  }
}

export default App;
