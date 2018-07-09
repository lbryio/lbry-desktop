// @flow
import React from 'react';

type Props = {
  children: ?React.node,
};

class Overlay extends React.PureComponent<Props> {
  render() {
    const { children } = this.props;
    return <div className="overlay">{children}</div>;
  }
}

export default Overlay;
