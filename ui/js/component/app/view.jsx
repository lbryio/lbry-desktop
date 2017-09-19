import React from "react";
import Router from "component/router/index";
import Header from "component/header";
import Theme from "component/theme";
import OverlayMedia from "component/overlayMedia";
import ModalRouter from "modal/modalRouter";
import lbry from "lbry";

class App extends React.PureComponent {
  componentWillMount() {
    const {
      alertError,
      checkUpgradeAvailable,
      updateBalance,
      fetchRewardedContent,
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

    fetchRewardedContent();

    this.scrollListener = () => this.props.recordScroll(window.scrollY);

    window.addEventListener("scroll", this.scrollListener);

    this.setTitleFromProps(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  componentWillReceiveProps(props) {
    this.setTitleFromProps(props);
  }

  setTitleFromProps(props) {
    window.document.title = props.pageTitle;
  }

  render() {
    const { keepMedia } = this.props;
    return (
      <div id="window">
        <Theme />
        <Header />
        <div id="main-content">
          {keepMedia && <OverlayMedia />}
          <Router />
        </div>
        <ModalRouter />
      </div>
    );
  }
}

export default App;
