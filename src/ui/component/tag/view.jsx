// @flow
import * as ICONS from 'constants/icons';

import React, { Fragment } from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import Button from 'component/button';

type Props = {
  name: string,
  type?: string,
  onClick?: any => any,
};

export default function Tag(props: Props) {
  const { name, type, onClick } = props;

  const clickProps = onClick ? { onClick } : { navigate: `/$/tags?t=${name}` };

  return (
    <Button
      {...clickProps}
      className={classnames('tag', {
        'tag--add': type === 'add',
        'tag--remove': type === 'remove',
      })}
      label={
        <Fragment>
          {name}
          {type && <Icon className="tag__action-label" icon={type === 'remove' ? ICONS.CLOSE : ICONS.ADD} />}
        </Fragment>
      }
    />
  );
}
