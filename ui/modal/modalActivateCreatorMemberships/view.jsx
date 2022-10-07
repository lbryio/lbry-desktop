// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';

type Props = {
  closeModal: () => void,
  bankAccountConfirmed: boolean,
};

export default function ModalRemoveCard(props: Props) {
  const { closeModal, bankAccountConfirmed } = props;

  const activateYourMembershipsText =
    'Once you activate your memberships users will be able to subscribe to your created tiers.\n' +
    '            If a user subscribes to your tier you will not be able to delete it until their subscription has been cancelled\n' +
    '            (by them or by you), so don’t activate your memberships until you’re ready!';

  const activateMembershipsButton = (
    <Button
      button="primary"
      icon={ICONS.MEMBERSHIP}
      label={__('Activate Memberships')}
      // onClick={deleteMembership}
    />
  );

  const addBankAccountButton = (
    <Button
      button="primary"
      icon={ICONS.FINANCE}
      label={__('Add A Bank Account')}
      navigate={`$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`}
    />
  );

  const needToAddABankAccountText =
    'Before you can activate your memberships you have to link a bank account first.\n' +
    '            This will be the way you can receive your monthly payments from users.\n' +
    '            Once you have linked your bank account you can click this button again and launch your memberships!';

  return (
    <Modal ariaHideApp={false} isOpen type="card" onAborted={closeModal}>
      <Card
        className="stripe__confirm-remove-membership"
        title={__('Activate Memberships')}
        subtitle={!bankAccountConfirmed ? needToAddABankAccountText : activateYourMembershipsText}
        actions={
          <div className="section__actions" style={{ marginTop: '10px' }}>
            {!bankAccountConfirmed ? addBankAccountButton : activateMembershipsButton}
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}
