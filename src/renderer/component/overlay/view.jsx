// @flow
import React from 'react';

type Props = {
  showOverlay: ?boolean,
  children: ?React.node,
};

class Overlay extends React.PureComponent<Props> {
  render() {
    const { showOverlay, children } = this.props;
    if (!showOverlay) return '';
    return <div className="overlay">{children}</div>;
  }
}

export default Overlay;
