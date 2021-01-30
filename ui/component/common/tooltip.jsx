// @flow
import type { Node } from 'react';
import React from 'react';

type Props = {
  label: string | Node,
  children: Node,
};

function Tooltip(props: Props) {
  const { children, label } = props;

  if (typeof label !== 'string') {
    return children;
  }

  return <span title={label}>{children}</span>;
}

export default Tooltip;
