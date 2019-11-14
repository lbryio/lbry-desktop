// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  isChannel: boolean,
  doOpenModal: (id: string, {}) => void,
};

export default function ShareButton(props: Props) {
  const { uri, doOpenModal, isChannel = false } = props;

  return (
    <Button
      button="alt"
      icon={ICONS.SHARE}
      label={__('Share')}
      onClick={() => doOpenModal(MODALS.SOCIAL_SHARE, { uri, webShareable: true, isChannel })}
    />
  );
}
