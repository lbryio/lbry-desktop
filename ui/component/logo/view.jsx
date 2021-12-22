// @flow
import { useIsMobile } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import React from 'react';

type Props = {
  currentTheme: string,
  type: string,
};

export default function Logo(props: Props) {
  const { currentTheme, type } = props;

  const isMobile = useIsMobile();
  const isLightTheme = currentTheme === 'light';

  if (type === 'embed' || type === 'embed-ended') {
    return <Icon className="embed__overlay-logo" icon={ICONS.ODYSEE_WHITE_TEXT} />;
  }

  if (type === 'small' || isMobile) {
    return <Icon className="header__logo" icon={ICONS.ODYSEE_LOGO} />;
  }

  return <Icon className="header__logo" icon={isLightTheme ? ICONS.ODYSEE_DARK_TEXT : ICONS.ODYSEE_WHITE_TEXT} />;
}
