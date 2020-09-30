// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  uri: string,
  doOpenModal: (string, {}) => void,
  fileAction?: boolean,
};

export default function ClaimSupportButton(props: Props) {
  const { doOpenModal, uri, fileAction } = props;

  return (
    <Button
      button="alt"
      button={fileAction ? undefined : 'alt'}
      className={classnames({ 'button--file-action': fileAction })}
      icon={ICONS.LBC}
      iconSize={fileAction ? 22 : undefined}
      label={__('Support')}
      requiresAuth={IS_WEB}
      title={__('Support this claim')}
      onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
    />
  );
}
