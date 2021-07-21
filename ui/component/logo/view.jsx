// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import { LOGO, LOGO_TEXT_LIGHT, LOGO_TEXT_DARK } from 'config';
import Icon from 'component/common/icon';

type Props = {
  type: string,
  currentTheme: string,
};

export default function Logo(props: Props) {
  const { type, currentTheme } = props;
  if (type === 'small') {
    return LOGO ? <img src={LOGO} /> : <Icon icon={ICONS.LBRY} />;
  } else {
    if (LOGO_TEXT_LIGHT && LOGO_TEXT_DARK) {
      return (
        <>
          {/*<img src={LOGO} className="mobile-only header__odysee" />*/}
          <img src={currentTheme === 'light' ? LOGO_TEXT_DARK : LOGO_TEXT_LIGHT} className="header__odysee" />
        </>
      );
    } else {
      return <Icon icon={ICONS.LBRY} />;
    }
  }
}
//mobile-hidden
