// @flow
import React from 'react';
import { ipcRenderer } from 'electron';
import classnames from 'classnames';

type Props = {};

type State = {
  hoverUrl: string,
  show: boolean,
};

class StatusBar extends React.PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      hoverUrl: '',
      show: false,
    };
    (this: any).handleUrlChange = this.handleUrlChange.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('update-target-url', this.handleUrlChange);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('update-target-url', this.handleUrlChange);
  }

  handleUrlChange(event: any, url: string) {
    // We want to retain the previous URL so that it can fade out
    // without the component collapsing.
    if (url === '') {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
      this.setState({ hoverUrl: url });
    }
  }

  render() {
    const { hoverUrl, show } = this.state;
    return <div className={classnames('status-bar', { visible: show })}>{decodeURI(hoverUrl)}</div>;
  }
}

export default StatusBar;
