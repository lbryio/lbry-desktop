// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  doOpenModal: (string, {}) => void,
  claim: StreamClaim,
  abandonActionCallback: any => void,
};

export default function ClaimAbandonButton(props: Props) {
  const { doOpenModal, claim, abandonActionCallback } = props;

  function abandonClaim() {
    doOpenModal(MODALS.CONFIRM_CLAIM_REVOKE, { claim: claim, cb: abandonActionCallback });
  }

  return <Button button="secondary" icon={ICONS.DELETE} onClick={abandonClaim} />;
}
