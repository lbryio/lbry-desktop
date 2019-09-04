// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  children: React.Node | Array<React.Node>,
  className: ?string,
};

function Page(props: Props) {
  const { children, className } = props;

  return <main className={classnames('main', className)}>{children}</main>;
}

export default Page;
