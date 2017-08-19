import React from "react";
import Router from "component/router/index";
import Header from "component/header";
import ModalRouter from "modal/modalRouter";
import lbry from "lbry";

class App extends React.PureComponent {
  componentWillMount() {
    const {
      alertError,
      checkUpgradeAvailable,
      updateBalance,
      fetchRewardedContent,
      setTheme,
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

    setTheme();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  render() {
    return (
      <div id="window">
        <Header />
        <div id="main-content">
          <Router />
        </div>
        <ModalRouter />
      </div>
    );
  }
}

export default App;
