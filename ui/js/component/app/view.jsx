import React from "react";
import Router from "component/router/index";
import Header from "component/header";
import Theme from "component/theme";
import ModalRouter from "modal/modalRouter";
import lbry from "lbry";

class App extends React.PureComponent {
  componentWillMount() {
    const {
      alertError,
      checkUpgradeAvailable,
      fetchRewardedContent,
    } = this.props;

    document.addEventListener("unhandledError", event => {
      alertError(event.detail);
    });

    if (!this.props.upgradeSkipped) {
      checkUpgradeAvailable();
    }

    fetchRewardedContent();

    this.setTitleFromProps(this.props);
  }

  componentDidMount() {
    this.scrollListener = () => this.props.recordScroll(mainContent.scrollTop);
    mainContent.addEventListener("scroll", this.scrollListener);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  componentWillReceiveProps(props) {
    this.setTitleFromProps(props);
  }

  setTitleFromProps(props) {
    window.document.title = props.pageTitle || "LBRY";
  }

  render() {
    return (
      <div id="window">
        <Theme />
        <Header />
        <div id="mainContent">
          <Router />
        </div>
        <ModalRouter />
      </div>
    );
  }
}

export default App;
