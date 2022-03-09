// @flow
import 'scss/component/_comment-badge.scss';

import * as ICONS from 'constants/icons';
import React from 'react';
import CommentBadge from './comment-badge';
import Button from 'component/button';

type Props = {
  membership: ?string,
  linkPage?: boolean,
  placement?: string,
  className?: string,
  hideTooltip?: boolean,
};

export default function PremiumBadge(props: Props) {
  const { membership, linkPage, placement, className, hideTooltip } = props;

  const badgeToShow = membership === 'Premium' ? 'silver' : membership === 'Premium+' ? 'gold' : null;

  if (!badgeToShow) return null;

  const badgeProps = { size: 40, placement, hideTooltip, className };

  return (
    <BadgeWrapper linkPage={linkPage}>
      {badgeToShow === 'silver' ? (
        <CommentBadge label={__('Premium')} icon={ICONS.PREMIUM} {...badgeProps} />
      ) : (
        badgeToShow === 'gold' && <CommentBadge label={__('Premium +')} icon={ICONS.PREMIUM_PLUS} {...badgeProps} />
      )}
    </BadgeWrapper>
  );
}

type WrapperProps = {
  linkPage?: boolean,
  children: any,
};

const BadgeWrapper = (props: WrapperProps) => {
  const { linkPage, children } = props;

  return linkPage ? (
    <Button navigate="/$/membership">
      {children}
    </Button>
  ) : (
    children
  );
};
