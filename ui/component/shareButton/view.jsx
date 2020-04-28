// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  doOpenModal: (id: string, {}) => void,
};

export default function ShareButton(props: Props) {
  const { uri, doOpenModal } = props;

  return (
    <Button
      button="alt"
      icon={ICONS.SHARE}
      label={__('Share')}
      title={__('Share this channel')}
      onClick={() => doOpenModal(MODALS.SOCIAL_SHARE, { uri, webShareable: true })}
    />
  );
}
