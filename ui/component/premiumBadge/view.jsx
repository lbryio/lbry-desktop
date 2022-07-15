// @flow
import 'scss/component/_comment-badge.scss';

import React from 'react';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import CommentBadge from 'component/common/comment-badge';
import Button from 'component/button';

type Props = {
  uri?: string,
  membership: ?string, // Retrieved from redux if `uri` is provided; else uses the given `membership` directly.
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
        <CommentBadge label="Premium" icon={ICONS.PREMIUM} {...badgeProps} />
      ) : (
        badgeToShow === 'gold' && <CommentBadge label="Premium+" icon={ICONS.PREMIUM_PLUS} {...badgeProps} />
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

  return linkPage ? <Button navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}`}>{children}</Button> : children;
};
