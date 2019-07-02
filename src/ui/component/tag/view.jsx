// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { MATURE_TAGS } from 'lbry-redux';
import Button from 'component/button';

type Props = {
  name: string,
  type?: string,
  onClick?: any => any,
  disabled: boolean,
};

export default function Tag(props: Props) {
  const { name, onClick, type = 'link', disabled = false } = props;
  const isMature = MATURE_TAGS.includes(name);
  const clickProps = onClick ? { onClick } : { navigate: `/$/tags?t=${name}` };

  let title;
  if (!onClick) {
    title = __('View tag');
  } else {
    title = type === 'add' ? __('Add tag') : __('Remove tag');
  }

  return (
    <Button
      {...clickProps}
      disabled={disabled}
      title={title}
      className={classnames('tag', {
        'tag--remove': type === 'remove',
        // tag--add only adjusts the color, which causes issues with mature tag color clashing
        'tag--add': !isMature && type === 'add',
        'tag--mature': isMature,
      })}
      label={name}
      iconSize={12}
      iconRight={type !== 'link' && (type === 'remove' ? ICONS.REMOVE : ICONS.ADD)}
    />
  );
}
