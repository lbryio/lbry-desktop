// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  name: string,
  type?: string,
  onClick?: any => any,
  disabled: boolean,
};

export default function Tag(props: Props) {
  const { name, onClick, type = 'link', disabled = false } = props;

  const clickProps = onClick ? { onClick } : { navigate: `/$/tags?t=${name}` };

  return (
    <Button
      {...clickProps}
      disabled={disabled}
      title={type === 'add' ? __('Add tag') : __('Remove tag')}
      className={classnames('tag', {
        'tag--add': type === 'add',
        'tag--remove': type === 'remove',
      })}
      label={name}
      iconSize={12}
      iconRight={type !== 'link' && (type === 'remove' ? ICONS.REMOVE : ICONS.ADD)}
    />
  );
}
