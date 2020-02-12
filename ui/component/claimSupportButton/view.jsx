// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  doOpenModal: (string, {}) => void,
};

export default function ClaimSupportButton(props: Props) {
  const { doOpenModal, uri } = props;

  return (
    <Button
      button="alt"
      icon={ICONS.SUPPORT}
      label={__('Support')}
      requiresAuth={IS_WEB}
      title={__('Support this claim')}
      onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
    />
  );
}
