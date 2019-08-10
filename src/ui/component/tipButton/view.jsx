// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  channelIsMine: boolean,
  doOpenModal: (id: string, { [key: string]: any }) => void,
};

export default function TipButton(props: Props) {
  const { uri, doOpenModal, channelIsMine } = props;

  if (!channelIsMine) {
    return (
      <Button
        button="alt"
        icon={ICONS.TIP}
        label={__('Tip')}
        title={__('Send a tip to this creator')}
        onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, claimIsMine: false, isSupport: false })}
      />
    );
  } else if (channelIsMine) {
    return (
      <Button
        button="alt"
        icon={ICONS.SUPPORT}
        label={__('Support')}
        title={__('Support this claim')}
        onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, claimIsMine: true, isSupport: true })}
      />
    );
  }
}
