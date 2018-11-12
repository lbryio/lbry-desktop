// @flow
import React from 'react';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import throttle from 'util/throttle';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import { openContextMenu } from '../../util/contextMenu';

type Props = {
  alertError: (string | {}) => void,
  recordScroll: number => void,
  currentStackIndex: number,
  currentPageAttributes: { path: string, scrollY: number },
  pageTitle: ?string,
  theme: string,
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
    document.documentElement.setAttribute('data-theme', theme);
  }

  componentDidMount() {
    const mainContent = document.getElementById('content');
    this.mainContent = mainContent;

    if (this.mainContent) {
      this.mainContent.addEventListener('scroll', throttle(this.scrollListener, 750));
    }

    ReactModal.setAppElement('#window'); // fuck this
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
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  componentWillUnmount() {
    if (this.mainContent) {
      this.mainContent.removeEventListener('scroll', this.scrollListener);
    }
  }

  setTitleFromProps = (title: ?string) => {
    window.document.title = title || 'LBRY';
  };

  scrollListener() {
    const { recordScroll } = this.props;
    const scrollAmount = document.querySelector('#content').scrollTop;
    if (this.mainContent) {
      recordScroll(this.mainContent.scrollTop);
    }

    // 2rem (padding) is 24px b/c body text is 12px
    if (scrollAmount >= 24) {
      document.querySelector('main.page').classList.add('scrolled');
    } else {
      document.querySelector('main.page').classList.remove('scrolled');
    }
  }

  mainContent: ?HTMLElement;

  render() {
    return (
      <div id="window" onContextMenu={e => openContextMenu(e)}>
        <Header />
        <main className="page">
          <SideBar />
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
