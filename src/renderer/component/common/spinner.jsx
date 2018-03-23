// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  dark?: boolean,
};

class Spinner extends React.Component<Props> {
  static defaultProps = {
    dark: false
  }

  render() {
    const { dark } = this.props;
    return (
      <div className={classnames('spinner', { 'spinner--dark': dark })}>
        <div className="rect rect1" />
        <div className="rect rect2" />
        <div className="rect rect3" />
        <div className="rect rect4" />
        <div className="rect rect5" />
      </div>
    );
  }
}

export default Spinner;
