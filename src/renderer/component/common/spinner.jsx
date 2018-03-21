// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  dark?: boolean,
}

const Spinner = (props: Props) => {
  const { dark } = props;
  return (
    <div className={classnames("spinner", { "spinner--dark": dark })}>
      <div className="rect rect1" />
      <div className="rect rect2" />
      <div className="rect rect3" />
      <div className="rect rect4" />
      <div className="rect rect5" />
    </div>
  );

}
export default Spinner;
