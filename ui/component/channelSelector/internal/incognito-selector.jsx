// @flow
import React from 'react';
import classnames from 'classnames';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

type Props = {
  isSelected?: boolean,
};

const IncognitoSelector = (props: Props) => {
  const { isSelected } = props;

  return (
    <div className={classnames('channel__list-item', { 'channel__list-item--selected': isSelected })}>
      <Icon sectionIcon icon={ICONS.ANONYMOUS} />
      <h2 className="channel__list-text">{__('Anonymous')}</h2>
      {isSelected && <Icon icon={ICONS.DOWN} />}
    </div>
  );
};

export default IncognitoSelector;
