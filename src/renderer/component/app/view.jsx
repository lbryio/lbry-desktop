// @flow
import React from 'react';
import Router from 'component/router/index';
import Theme from 'component/theme';
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
};

class App extends React.PureComponent<Props> {
  constructor() {
    super();
    this.mainContent = undefined;
    (this: any).scrollListener = this.scrollListener.bind(this);
  }

  componentWillMount() {
    const { alertError } = this.props;

    // TODO: create type for this object
    // it lives in jsonrpc.js
    document.addEventListener('unhandledError', (event: any) => {
      alertError(event.detail);
    });
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
    const { currentStackIndex: prevStackIndex } = prevProps;
    const { currentStackIndex, currentPageAttributes } = this.props;

    if (this.mainContent && currentStackIndex !== prevStackIndex && currentPageAttributes) {
      this.mainContent.scrollTop = currentPageAttributes.scrollY || 0;
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
    if (this.mainContent) {
      recordScroll(this.mainContent.scrollTop);
    }
  }

  mainContent: ?HTMLElement;

  render() {
    return (
      <div id="window" onContextMenu={e => openContextMenu(e)}>
        <Theme />
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
