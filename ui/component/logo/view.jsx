// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import { LOGO_TITLE, LOGO, LOGO_TEXT_LIGHT, LOGO_TEXT_DARK } from 'config';
import Icon from 'component/common/icon';
import { useIsMobile } from 'effects/use-screensize';
import OptimizedImage from 'component/optimizedImage';

type Props = {
  type: string,
  currentTheme: string,
};

export default function Logo(props: Props) {
  const { type, currentTheme } = props;
  const isMobile = useIsMobile();
  const defaultWithLabel = (
    <>
      <Icon icon={ICONS.LBRY} />
      {/* @if TARGET='app' */}
      <div className={'button__label'}>{'LBRY'}</div>
      {/* @endif */}
      {/* @if TARGET='web' */}
      <div className={'button__label'}>{LOGO_TITLE}</div>
      {/* @endif */}
    </>
  );

  if (type === 'small' || (isMobile && type !== 'embed')) {
    return LOGO ? <OptimizedImage src={LOGO} /> : <Icon icon={ICONS.LBRY} />;
  } else if (type === 'embed') {
    if (LOGO_TEXT_LIGHT) {
      return (
        <>
          <OptimizedImage src={LOGO_TEXT_LIGHT} />
        </>
      );
    } else {
      return defaultWithLabel;
    }
  } else {
    if (LOGO_TEXT_LIGHT && LOGO_TEXT_DARK) {
      return (
        <>
          <OptimizedImage src={currentTheme === 'light' ? LOGO_TEXT_DARK : LOGO_TEXT_LIGHT} />
        </>
      );
    } else {
      return defaultWithLabel;
    }
  }
}
