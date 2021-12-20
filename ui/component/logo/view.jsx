// @flow
import { LOGO_TITLE, LOGO, LOGO_WHITE_TEXT, LOGO_DARK_TEXT } from 'config';
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

  const defaultWithLabel = (
    <>
      <Icon icon={ICONS.LBRY} />
      <div className="button__label">{LOGO_TITLE}</div>
    </>
  );

  if (LOGO_WHITE_TEXT && (type === 'embed' || type === 'embed-ended')) {
    return <img className="embed__overlay-logo" src={LOGO_WHITE_TEXT} />;
  }

  if (type === 'small' || isMobile) {
    return <img className="header__navigation-logo" src={LOGO} height={200} width={200} />;
  }

  if (LOGO_WHITE_TEXT && LOGO_DARK_TEXT) {
    return (
      <img
        className="header__navigation-logo"
        height={300}
        width={1000}
        src={isLightTheme ? LOGO_DARK_TEXT : LOGO_WHITE_TEXT}
      />
    );
  }

  return defaultWithLabel;
}
