// @flow
import React from 'react';
import classnames from 'classnames';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
type Props = {
  count: number,
};

export default function collectionCount(props: Props) {
  const { count = 0 } = props;

  return (
    <div className={classnames('claim-preview__overlay-properties', 'claim-preview__overlay-properties--small')}>
      <Icon icon={ICONS.STACK} />
      <div>{count}</div>
    </div>
  );
}
