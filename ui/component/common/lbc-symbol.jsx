// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';

type Props = {
  withText?: boolean,
  isTitle?: boolean,
  size?: number,
  prefix?: string | number,
};

const LbcSymbol = (props: Props) => {
  const { prefix, size, isTitle = false } = props;
  return (
    <>
      {prefix}
      <Icon
        icon={ICONS.LBC}
        size={isTitle ? 22 : size}
        className={classnames('icon__lbc', { 'icon__lbc--with-text': prefix, 'icon__lbc--title': isTitle })}
      />
    </>
  );
};

export default LbcSymbol;
