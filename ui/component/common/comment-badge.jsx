// @flow
import 'scss/component/_comment-badge.scss';

import Icon from 'component/common/icon';
import React from 'react';
import Tooltip from 'component/common/tooltip';

type Props = {
  icon: string,
  label: string,
  size?: number,
  placement?: string,
  hideTooltip?: boolean,
  className?: string,
};

export default function CommentBadge(props: Props) {
  const { icon, label, size = 20, placement = 'top', hideTooltip, className } = props;

  return (
    <BadgeWrapper title={label} placement={placement} hideTooltip={hideTooltip} className={className}>
      <span className="comment__badge">
        <Icon icon={icon} size={size} />
      </span>
    </BadgeWrapper>
  );
}

type WrapperProps = {
  hideTooltip?: boolean,
  children: any,
};

const BadgeWrapper = (props: WrapperProps) => {
  const { hideTooltip, children, ...tooltipProps } = props;

  return !hideTooltip ? <Tooltip {...tooltipProps}>{children}</Tooltip> : children;
};
