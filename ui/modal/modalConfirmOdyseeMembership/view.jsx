// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

type Props = {
  closeModal: () => void,
  paymentMethodId: string,
  setAsConfirmingCard: () => void, // ?
  hasMembership: boolean, // user already has purchased --> invoke Cancel then
  membershipId: string,
  populateMembershipData: () => void,
  userChannelClaimId: string,
  userChannelName: string,
  priceId: string,
  purchaseString: string,
  plan: string,
  setMembershipOptions: (any) => void,
  doToast: ({ message: string }) => void,
  updateUserOdyseeMembershipStatus: ({}) => void,
  user: ?User,
};

export default function ConfirmOdyseeMembershipPurchase(props: Props) {
  const {
    closeModal,
    membershipId,
    populateMembershipData,
    userChannelClaimId,
    userChannelName,
    hasMembership,
    priceId,
    purchaseString,
    plan,
    setMembershipOptions,
    doToast,
    updateUserOdyseeMembershipStatus,
    user,
  } = props;

  const [waitingForBackend, setWaitingForBackend] = React.useState();
  const [statusText, setStatusText] = React.useState();

  async function purchaseMembership() {
    try {
      setWaitingForBackend(true);
      setStatusText(__('Completing your purchase...'));

      // show the memberships the user is subscribed to
      await Lbryio.call(
        'membership',
        'buy',
        {
          environment: stripeEnvironment,
          membership_id: membershipId,
          channel_id: userChannelClaimId,
          channel_name: userChannelName,
          price_id: priceId,
        },
        'post'
      );

      // cleary query params
      // $FlowFixMe
      let newURL = location.href.split('?')[0];
      window.history.pushState('object', document.title, newURL);

      setStatusText(__('Membership was successful'));

      // populate the new data and update frontend
      await populateMembershipData();

      // clear the other membership options after making a purchase
      setMembershipOptions(false);

      if (user) updateUserOdyseeMembershipStatus(user);

      closeModal();
    } catch (err) {
      const errorMessage = err.message;

      const subscriptionFailedBackendError = 'failed to create subscription with default card';

      // wait a bit to show the message so it's not jarring for the user
      let errorMessageTimeout = 1150;

      // don't do an error delay if there's already a network error
      if (errorMessage === subscriptionFailedBackendError) {
        errorMessageTimeout = 0;
      }

      setTimeout(function () {
        const genericErrorMessage = __(
          "Sorry, your purchase wasn't able to completed. Please contact support for possible next steps"
        );

        doToast({
          message: genericErrorMessage,
          isError: true,
        });

        closeModal();
      }, errorMessageTimeout);

      console.log(err);
    }
  }

  // Cancel
  async function cancelMembership() {
    try {
      setWaitingForBackend(true);
      setStatusText(__('Canceling your membership...'));

      // show the memberships the user is subscribed to
      await Lbryio.call(
        'membership',
        'cancel',
        {
          environment: stripeEnvironment,
          membership_id: membershipId,
        },
        'post'
      );

      setStatusText(__('Membership successfully canceled'));

      // populate the new data and update frontend
      await populateMembershipData();

      closeModal();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal ariaHideApp={false} isOpen contentLabel={'Confirm Membership Purchase'} type="card" onAborted={closeModal}>
      <Card
        className="stripe__confirm-remove-membership"
        title={hasMembership ? __('Confirm Membership Cancellation') : __('Confirm %plan% Membership', { plan })}
        subtitle={purchaseString}
        actions={
          <div className="section__actions">
            {!waitingForBackend ? (
              <>
                <Button
                  className="stripe__confirm-remove-card"
                  button="primary"
                  icon={ICONS.FINANCE}
                  label={hasMembership ? __('Confirm Cancellation') : __('Confirm Purchase')}
                  onClick={() => (hasMembership ? cancelMembership() : purchaseMembership())}
                />
                <Button button="link" label={__('Cancel')} onClick={closeModal} />
              </>
            ) : (
              <h1 style={{ fontSize: '18px' }}>{statusText}</h1>
            )}
          </div>
        }
      />
    </Modal>
  );
}
