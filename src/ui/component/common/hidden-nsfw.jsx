// @flow
import React from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';

type Props = {
  type?: string,
};

export default function HiddenNsfw(props: Props) {
  const { type = 'page' } = props;

  return (
    <div className="section--padded section__subtitle">
      <Icon className="icon--hidden" icon={ICONS.EYE_OFF} />
      <I18nMessage tokens={{ type, settings: <Button button="link" label={__('settings')} href="/$/settings" /> }}>
        Content may be hidden on this %type% because of your %settings%
      </I18nMessage>
    </div>
  );
}
