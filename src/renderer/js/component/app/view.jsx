import React from "react";
import Router from "component/router/index";
import Header from "component/header";
import Theme from "component/theme";
import ModalRouter from "modal/modalRouter";
import lbry from "lbry";
import throttle from "util/throttle";
import VideoPlayer from "component/videoPlayer";
import { Icon } from "component/common";

class App extends React.PureComponent {
  constructor() {
    super();
    this.mainContent = undefined;
  }

  componentWillMount() {
    const { alertError } = this.props;

    document.addEventListener("unhandledError", event => {
      alertError(event.detail);
    });
  }

  componentDidMount() {
    const { recordScroll } = this.props;
    const mainContent = document.getElementById("main-content");
    this.mainContent = mainContent;

    const scrollListener = () => recordScroll(this.mainContent.scrollTop);

    this.mainContent.addEventListener("scroll", throttle(scrollListener, 750));
  }

  componentWillUnmount() {
    this.mainContent.removeEventListener("scroll", this.scrollListener);
  }

  componentWillReceiveProps(props) {
    this.setTitleFromProps(props);
  }

  componentDidUpdate(prevProps) {
    const { currentStackIndex: prevStackIndex } = prevProps;
    const { currentStackIndex, currentPageAttributes } = this.props;

    if (currentStackIndex !== prevStackIndex) {
      this.mainContent.scrollTop = currentPageAttributes.scrollY || 0;
    }
  }

  setTitleFromProps(props) {
    window.document.title = props.pageTitle || "LBRY";
  }

  renderVideo() {
    const { playingUri, currentPage } = this.props;

    if (playingUri !== null && currentPage !== "show") {
      return <VideoPlayer overlay={true} uri={playingUri} />;
    }
  }

  render() {
    return (
      <div id="window">
        <Theme />
        <Header />
        <div id="main-content">
          {this.renderVideo()}
          <Router />
        </div>
        <ModalRouter />
      </div>
    );
  }
}

export default App;
