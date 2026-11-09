import React from 'react';
import MUITooltip from '@mui/material/Tooltip';
import type { ReactNode } from 'react';

type Props = {
  arrow?: boolean,
  children: React.ReactNode,
  disableInteractive?: boolean,
  enterDelay?: number,
  title?: string | React.ReactNode
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
      {/* @ts-expect-error - TS2739 (ts-migration) */}
      {children}
    </MUITooltip>
  );
}

export default Tooltip;
