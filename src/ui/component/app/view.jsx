// @flow
import React from 'react';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import { openContextMenu } from 'util/context-menu';
import EnhancedLayoutListener from 'util/enhanced-layout';
import Yrbl from 'component/yrbl';

const TWO_POINT_FIVE_MINUTES = 1000 * 60 * 2.5;

type Props = {
  alertError: (string | {}) => void,
  pageTitle: ?string,
  theme: string,
  updateBlockHeight: () => void,
  toggleEnhancedLayout: () => void,
  enhancedLayout: boolean,
};

class App extends React.PureComponent<Props> {
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

    ReactModal.setAppElement('#window'); // fuck this

    this.enhance = new EnhancedLayoutListener(() => toggleEnhancedLayout());

    updateBlockHeight();
    setInterval(() => {
      updateBlockHeight();
    }, TWO_POINT_FIVE_MINUTES);
  }

  componentDidUpdate(prevProps: Props) {
    const { theme: prevTheme } = prevProps;
    const { theme } = this.props;

    if (prevTheme !== theme) {
      // $FlowFixMe
      document.documentElement.setAttribute('data-mode', theme);
    }
  }

  componentWillUnmount() {
    this.enhance = null;
  }

  enhance: ?any;

  render() {
    const { enhancedLayout } = this.props;

    return (
      <div id="window" onContextMenu={e => openContextMenu(e)}>
        <Header />
        <section className="page">
          {enhancedLayout && <Yrbl className="yrbl--enhanced" />}
          <SideBar />
          <div className="content" id="content">
            <Router />
            <ModalRouter />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
