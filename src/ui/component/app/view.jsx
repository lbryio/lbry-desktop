// @flow
import React from 'react';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import throttle from 'util/throttle';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import { openContextMenu } from 'util/context-menu';
import EnhancedLayoutListener from 'util/enhanced-layout';
import Yrbl from 'component/yrbl';

const TWO_POINT_FIVE_MINUTES = 1000 * 60 * 2.5;

type Props = {
  alertError: (string | {}) => void,
  recordScroll: number => void,
  currentStackIndex: number,
  currentPageAttributes: { path: string, scrollY: number },
  pageTitle: ?string,
  theme: string,
  updateBlockHeight: () => void,
  toggleEnhancedLayout: () => void,
  enhancedLayout: boolean,
};

class App extends React.PureComponent<Props> {
  constructor() {
    super();
    this.mainContent = undefined;
    (this: any).scrollListener = this.scrollListener.bind(this);
  }

  componentWillMount() {
    const { alertError, theme } = this.props;

    // TODO: create type for this object
    // it lives in jsonrpc.js
    document.addEventListener('unhandledError', (event: any) => {
      alertError(event.detail);
    });

    // $FlowFixMe
    document.documentElement.setAttribute('data-mode', theme);
  }

  componentDidMount() {
    const { updateBlockHeight, toggleEnhancedLayout } = this.props;

    const mainContent = document.getElementById('content');
    this.mainContent = mainContent;
    if (this.mainContent) {
      this.mainContent.addEventListener('scroll', throttle(this.scrollListener, 750));
    }

    ReactModal.setAppElement('#window'); // fuck this

    this.enhance = new EnhancedLayoutListener(() => toggleEnhancedLayout());

    updateBlockHeight();
    setInterval(() => {
      updateBlockHeight();
    }, TWO_POINT_FIVE_MINUTES);
  }

  componentWillReceiveProps(props: Props) {
    const { pageTitle } = props;
    this.setTitleFromProps(pageTitle);
  }

  componentDidUpdate(prevProps: Props) {
    const { currentStackIndex: prevStackIndex, theme: prevTheme } = prevProps;
    const { currentStackIndex, currentPageAttributes, theme } = this.props;

    if (this.mainContent && currentStackIndex !== prevStackIndex && currentPageAttributes) {
      this.mainContent.scrollTop = currentPageAttributes.scrollY || 0;
    }

    if (prevTheme !== theme) {
      // $FlowFixMe
      document.documentElement.setAttribute('data-mode', theme);
    }
  }

  componentWillUnmount() {
    if (this.mainContent) {
      this.mainContent.removeEventListener('scroll', this.scrollListener);
    }

    this.enhance = null;
  }

  setTitleFromProps = (title: ?string) => {
    window.document.title = title || 'LBRY';
  };

  scrollListener() {
    const { recordScroll } = this.props;

    if (this.mainContent) {
      recordScroll(this.mainContent.scrollTop);
    }
  }

  mainContent: ?HTMLElement;
  enhance: ?any;

  render() {
    const { enhancedLayout } = this.props;

    return (
      <div id="window" onContextMenu={e => openContextMenu(e)}>
        <Header />
        <main className="page">
          {enhancedLayout && <Yrbl className="yrbl--enhanced" />}
          {/* @if TARGET='app' */}
          <SideBar />
          {/* @endif */}
          <div className="content" id="content">
            <Router />
            <ModalRouter />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
