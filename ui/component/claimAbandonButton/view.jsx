// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  doOpenModal: (string, {}) => void,
  claim: Claim,
  abandonActionCallback: (any) => void,
  iconSize: number,
};

export default function ClaimAbandonButton(props: Props) {
  const { doOpenModal, claim, abandonActionCallback } = props;
  const { value_type } = claim || {};
  let buttonLabel;
  if (value_type === 'channel') {
    buttonLabel = __('Delete Channel');
  } else if (value_type === 'collection') {
    buttonLabel = __('Delete List');
  } else if (value_type === 'stream') {
    buttonLabel = __('Delete Publish');
  }

  function abandonClaim() {
    doOpenModal(MODALS.CONFIRM_CLAIM_REVOKE, { claim: claim, cb: abandonActionCallback });
  }

  return (
    <Button
      disabled={!claim}
      label={buttonLabel}
      button="alt"
      iconColor="red"
      icon={ICONS.DELETE}
      onClick={abandonClaim}
    />
  );
}
