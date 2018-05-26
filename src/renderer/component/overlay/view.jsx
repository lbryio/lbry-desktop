// @flow
import React from 'react';

type Props = {
  showOverlay: ?boolean,
  children: ?React.node,
};

class Overlay extends React.PureComponent<Props> {
  render() {
    const { showOverlay, children } = this.props;
    return <div className="overlay">{showOverlay ? children : ''}</div>;
  }
}

export default Overlay;
