import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  doOpenModal: (id: string, arg2: Record<any, any>) => void
};

export default function ShareButton(props: Props) {
  const { uri, doOpenModal } = props;

  return (
    <Button
      // @ts-expect-error - TS2322 (ts-migration)
      button="secondary"
      icon={ICONS.SHARE}
      label={__('Share')}
      title={__('Share this channel')}
      onClick={() => doOpenModal(MODALS.SOCIAL_SHARE, { uri, webShareable: true })}
    />
  );
}
