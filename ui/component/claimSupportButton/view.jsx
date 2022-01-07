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
  disableSupport: boolean,
  claim: GenericClaim,
};

export default function ClaimSupportButton(props: Props) {
  const { doOpenModal, uri, fileAction, disableSupport, claim } = props;
  const isRepost = claim && claim.repost_url;

  if (disableSupport) {
    return null;
  }

  return (
    <Button
      button={fileAction ? undefined : 'alt'}
      className={classnames({ 'button--file-action': fileAction })}
      icon={ICONS.LBC}
      iconSize={fileAction ? 22 : undefined}
      label={isRepost ? __('Support Repost') : __('Support --[button to support a claim]--')}
      title={__('Support this claim')}
      onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
    />
  );
}
