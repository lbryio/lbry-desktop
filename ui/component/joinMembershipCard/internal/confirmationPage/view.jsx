// @flow
import React from 'react';

import * as STRIPE from 'constants/stripe';

import BusyIndicator from 'component/common/busy-indicator';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import ErrorBubble from 'component/common/error-bubble';
import I18nMessage from 'component/i18nMessage';
import { Submit } from 'component/common/form';

import withCreditCard from 'hocs/withCreditCard';

type Props = {
  selectedTier: CreatorMembership,
  selectedMembershipIndex: number,
  onCancel: () => void,
  // -- redux --
  channelName: string,
  purchasePending: boolean,
  preferredCurrency: ?string,
  incognito: boolean,
};

const ConfirmationPage = (props: Props) => {
  const {
    selectedTier,
    selectedMembershipIndex,
    onCancel,
    channelName,
    purchasePending,
    preferredCurrency,
    incognito,
  } = props;

  const total = (selectedTier.NewPrices[0].Price.amount / 100).toFixed(2);
  const creatorRevenue = (selectedTier.NewPrices[0].creator_receives_amount / 100).toFixed(2);
  const processingFee = (selectedTier.NewPrices[0].fees.stripe_fee / 100).toFixed(2);
  const odyseeFee = (selectedTier.NewPrices[0].fees.odysee_fee / 100).toFixed(2);

  return (
    <div className="confirm__wrapper">
      <h1>{__('Almost done')}</h1>
      <ConfirmationSection
        label={__(`Join %channelName%'s Membership As`, { channelName })}
        value={<ChannelSelector />}
      />
      <section>
        <label>{__('Membership Tier')}</label>
        <span>
          <div className="dot" />
          {selectedTier.Membership.name}
        </span>
      </section>
      <ConfirmationSection label={__('Description')} value={selectedTier.Membership.description} />

      <section>
        <label>{__('Total Monthly Cost')}</label>
        <span className="total-membership-price">
          <span className="total">${total}</span>
          <span className="hide-on-mobile">{' ('}</span>
          <span>
            {__('Creator revenue')}: ${creatorRevenue}
          </span>
          <span className="hide-on-mobile">{', '}</span>
          <span>
            {__('Payment processing fee')}: ${processingFee}
          </span>
          <span className="hide-on-mobile">{', '}</span>
          <span>
            {__('Odysee platform fee')}: ${odyseeFee}
          </span>
          <span className="hide-on-mobile">{')'}</span>
        </span>
      </section>
      {selectedTier.Perks && selectedTier.Perks.length > 0 && (
        <ConfirmationSection
          label={__('Features and Perks')}
          value={
            <ul className="ul--no-style membership-tier__perks">
              {/* $FlowFixMe -- already handled above */}
              {selectedTier.Perks.map((tierPerk, i) => (
                <li key={i}>{__(tierPerk.name)}</li>
              ))}
            </ul>
          }
        />
      )}

      {preferredCurrency && preferredCurrency === STRIPE.CURRENCIES.EUR ? (
        <>
          <ErrorBubble>
            {__('You currently have EUR selected as your preferred currency, currently only USD is supported.')}
          </ErrorBubble>

          <div className="section__actions">
            <Button button="primary" label={__('Change Settings')} navigate="/$/settings/card" />
          </div>
        </>
      ) : purchasePending ? (
        <BusyIndicator message={__('Processing payment...')} />
      ) : (
        <>
          <div className="section__actions">
            {incognito && (
              <p className="help">
                <div className="error__text">
                  {__("You are about to join as Anonymous, you won't be able to view or comment on chat at this time")}
                </div>
              </p>
            )}

            <SubmitButton modalState={{ passedTierIndex: selectedMembershipIndex }} />
            <Button button="link" label={__('Cancel')} onClick={onCancel} />
          </div>

          <p className="help">
            <I18nMessage
              tokens={{
                membership_terms_and_conditions: (
                  <Button
                    button="link"
                    href="https://help.odysee.tv/category-memberships/"
                    label={__('Membership Terms and Conditions')}
                  />
                ),
              }}
            >
              By continuing, you accept the %membership_terms_and_conditions%.
            </I18nMessage>
          </p>
        </>
      )}
    </div>
  );
};

type GroupProps = {
  className?: string,
  label: string,
  value: string | React$Node,
  style?: any,
};

const ConfirmationSection = (props: GroupProps) => {
  const { label, value } = props;

  return (
    <section>
      <label>{label}</label>
      <span>{value}</span>
    </section>
  );
};

const SubmitButton = withCreditCard(() => <Submit autoFocus button="primary" label={__('Confirm')} />);

export default ConfirmationPage;
