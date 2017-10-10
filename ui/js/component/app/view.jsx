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

    document.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
    });

    document.addEventListener("dragover", event => {
      event.preventDefault();
      event.stopPropagation();
    });

    if (!this.props.upgradeSkipped) {
      checkUpgradeAvailable();
    }

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
    return (
      <div id="window">
        <Theme />
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
