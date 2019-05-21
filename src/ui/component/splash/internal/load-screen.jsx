// @flow
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import Icon from 'component/common/icon';
import Spinner from 'component/spinner';
import Button from 'component/button';
// import Doodle from 'component/doodle';
import 'css-doodle';

type Props = {
  message: string,
  details: ?string,
  isWarning: boolean,
  error: boolean,
};

// const FancyDoodle = Doodle``; // this looks dumb but it prevents repetition from `_load-screen.scss`

class LoadScreen extends React.PureComponent<Props> {
  static defaultProps = {
    isWarning: false,
  };

  render() {
    const { details, message, isWarning, error } = this.props;

    return (
      <div className="load-screen">
        <h1 className="load-screen__title">{__('LBRY')}</h1>
        <css-doodle use="var(--rule)" />
      </div>
    );
  }
}

export default LoadScreen;
