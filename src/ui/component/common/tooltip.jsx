// @flow
import type { Node } from 'react';
import React from 'react';
import ReachTooltip from '@reach/tooltip';
import '@reach/tooltip/styles.css';

type Props = {
  label: string | Node,
  children?: Node,
};

function Tooltip(props: Props) {
  const { children, label } = props;

  return <ReachTooltip label={label}>{children}</ReachTooltip>;
}

export default Tooltip;
