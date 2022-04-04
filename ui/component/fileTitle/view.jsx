// @flow
import type { Node } from 'react';
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  title: string,
  className?: string,
  children?: Node,
};

function FileTitle(props: Props) {
  const { title, children, className } = props;

  return (
    <h1 className={classnames(className)}>
      <span>{title}</span>
      {children}
    </h1>
  );
}

export default FileTitle;
