// @flow
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';

type Props = {
  withText?: boolean,
  isTitle?: boolean,
  size?: number,
  prefix?: string | number | Node,
  postfix?: string | number | Node,
};

const LbcSymbol = (props: Props) => {
  const { prefix, postfix, size, isTitle = false } = props;
  return (
    <>
      {prefix}
      <Icon
        icon={ICONS.LBC}
        size={isTitle ? 22 : size}
        className={classnames('icon__lbc', {
          'icon__lbc--before-text': prefix,
          'icon__lbc--after-text': postfix,
          'icon__lbc--title': isTitle,
        })}
      />
      {postfix}
    </>
  );
};

export default LbcSymbol;
