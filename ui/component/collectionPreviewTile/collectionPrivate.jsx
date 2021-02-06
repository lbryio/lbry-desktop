// @flow
import React from 'react';
import classnames from 'classnames';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

export default function collectionCount() {
  return (
    <div className={classnames('claim-preview__overlay-properties', 'claim-preview__overlay-properties--small')}>
      <Icon icon={ICONS.LOCK} />
      <div>{__('Private')}</div>
    </div>
  );
}
