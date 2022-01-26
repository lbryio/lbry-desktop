// @flow
import React from 'react';
import MUITooltip from '@mui/material/Tooltip';
import type { Node } from 'react';

type Props = {
  arrow?: boolean,
  children: Node,
  disableInteractive?: boolean,
  enterDelay?: number,
  title?: string | Node,
};

function Tooltip(props: Props) {
  const { arrow = true, children, disableInteractive = true, enterDelay = 300, title } = props;

  return (
    <MUITooltip
      arrow={arrow}
      disableInteractive={disableInteractive}
      enterDelay={enterDelay}
      enterNextDelay={enterDelay}
      title={title}
    >
      {children}
    </MUITooltip>
  );
}

export default Tooltip;
