// @ts-expect-error - TS2882 (ts-migration)
import 'scss/component/_comment-badge.scss';

import classnames from 'classnames';
import Icon from 'component/common/icon';
import React from 'react';
import Tooltip from 'component/common/tooltip';

const LABEL_TYPES = {
  ADMIN: 'Admin',
  MOD: 'Moderator',
} as const;

type Props = {
  icon: string,
  label: string,
  size?: number
};

export default function CommentBadge(props: Props) {
  const { icon, label, size = 20 } = props;

  return (
    // @ts-expect-error - TS2322 (ts-migration)
    <Tooltip title={label} placement="top">
      <span
        className={classnames('comment__badge', {
          'comment__badge--globalMod': label === LABEL_TYPES.ADMIN,
          'comment__badge--mod': label === LABEL_TYPES.MOD,
        })}
      >
        <Icon icon={icon} size={size} />
      </span>
    </Tooltip>
  );
}
