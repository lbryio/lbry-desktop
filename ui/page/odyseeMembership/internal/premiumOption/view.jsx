// @flow
import React from 'react';

import { formatDateToMonthDayAndYear } from 'util/time';

import * as MEMBERSHIP_CONSTS from 'constants/memberships';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as STRIPE from 'constants/stripe';

import Button from 'component/button';
import MembershipBadge from 'component/membershipBadge';

type Props = {
  membershipPurchase?: CreatorMembership,
  membershipView?: MembershipTier,
  // -- redux --
  preferredCurrency: CurrencyOption,
  doOpenModal: (modalId: string, {}) => void,
  doOpenCancelationModalForMembership: (membership: MembershipTier) => void,
};

const PremiumOption = (props: Props) => {
  const {
    membershipPurchase,
    membershipView,
    preferredCurrency,
    doOpenModal,
    doOpenCancelationModalForMembership,
  } = props;

  if (membershipPurchase) {
    const membership = membershipPurchase;
    const { Membership, NewPrices } = membership;

    const purchaseFieldsProps = { preferredCurrency, membership, doOpenModal };

    return (
      <Wrapper name={Membership.name}>
        {NewPrices.map(({ Price, StripePrice }: MembershipNewStripePriceDetails) => (
          <PurchaseFields key={Membership.id} {...purchaseFieldsProps} stripePrice={StripePrice} />
        ))}
      </Wrapper>
    );
  }

  if (membershipView) {
    const membership = membershipView;
    const { Membership, MembershipDetails, Subscription } = membership;

    const isCancelled = Subscription.status === 'canceled';
    const membershipStillValid = isCancelled && Subscription.current_period_end * 1000 > Date.now();

    return (
      <Wrapper name={MembershipDetails.name}>
        <h4 className="membership_info">
          <b>{__('Registered On')}:</b> {formatDateToMonthDayAndYear(Membership.created_at)}
        </h4>

        <h4 className="membership_info">
          <b>{__(isCancelled ? 'Canceled On' : 'Auto-Renews On')}:</b>{' '}
          {formatDateToMonthDayAndYear(
            (isCancelled ? Subscription.canceled_at : Subscription.current_period_end) * 1000
          )}
        </h4>

        <h4 className="membership_info">
          <b>{__(membershipStillValid ? 'Still Valid Until' : 'Ended on')}:</b>{' '}
          {formatDateToMonthDayAndYear(Subscription.current_period_end * 1000)}
        </h4>

        {(!isCancelled ? Subscription.canceled_at === 0 : !membershipStillValid) && (
          <Button
            button="alt"
            membership-id={Membership.membership_id}
            onClick={() => doOpenCancelationModalForMembership(membership)}
            className="cancel-membership-button"
            label={__('Cancel membership')}
            icon={ICONS.FINANCE}
          />
        )}
      </Wrapper>
    );
  }

  return null;
};

type WrapperProps = {
  name: string,
  children: any,
};

const Wrapper = (props: WrapperProps) => {
  const { name, children } = props;

  return (
    <div className="premium-option" key={name}>
      <h4 className="membership_title">
        {name}
        <MembershipBadge membershipName={name} />
      </h4>

      <h4 className="membership_subtitle">{__(MEMBERSHIP_CONSTS.DESCRIPTIONS[name])}</h4>

      {children}
    </div>
  );
};

type PurchaseProps = {
  preferredCurrency: string,
  membership: CreatorMembership,
  stripePrice: StripePriceDetails,
  doOpenModal: (modalId: string, {}) => void,
};

const PurchaseFields = (props: PurchaseProps) => {
  const { preferredCurrency, membership, stripePrice, doOpenModal } = props;

  const {
    currency: priceCurrency,
    unit_amount: amount,
    recurring: { interval },
  } = stripePrice;
  const currency = priceCurrency.toUpperCase();

  return (
    currency === preferredCurrency && (
      <React.Fragment key={membership.Membership.id}>
        <h4 className="membership_info">
          <b>{__('Interval')}:</b> {__(MEMBERSHIP_CONSTS.INTERVALS[interval])}
        </h4>

        <h4 className="membership_info">
          <b>{__('Price')}:</b> {currency + ' ' + STRIPE.CURRENCY[currency].symbol}
          {amount / 100} / {__(MEMBERSHIP_CONSTS.INTERVALS[interval])}
        </h4>

        <Button
          button="primary"
          onClick={() => doOpenModal(MODALS.CONFIRM_ODYSEE_MEMBERSHIP, { membership, price: stripePrice })}
          className="membership_button"
          label={__('Join via %interval% membership', { interval: __(interval) })}
          icon={ICONS.FINANCE}
        />
      </React.Fragment>
    )
  );
};

export default PremiumOption;
