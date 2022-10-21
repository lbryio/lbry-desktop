// @flow
import React from 'react';
import classnames from 'classnames';

import './style.scss';
import FeeBreakdown from './internal/feeBreakdown';
import Button from 'component/button';
import { FormField, FormFieldPrice } from 'component/common/form';
import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';
import FormFieldDurationCombo from 'component/formFieldDurationCombo';
import I18nMessage from 'component/i18nMessage';
import { PAYWALL } from 'constants/publish';
import usePersistedState from 'effects/use-persisted-state';
import ButtonStripeConnectAccount from 'component/buttonStripeConnectAccount';

const FEE = { MIN: 1, MAX: 999.99 };
const CURRENCY_OPTIONS = ['USD']; // ['USD', 'EUR']; // disable EUR until currency approach is determined.

type Props = {
  disabled: boolean,
  isMarkdownPost: boolean,
  // --- redux ---
  fileMime: ?string,
  streamType: ?string,
  fiatPurchaseEnabled: boolean,
  fiatPurchaseFee: Price,
  fiatRentalEnabled: boolean,
  fiatRentalFee: Price,
  fiatRentalExpiration: Duration,
  paywall: Paywall,
  fee: Fee,
  restrictedToMemberships: ?string,
  chargesEnabled: ?boolean,
  updatePublishForm: ({}) => void,
  doTipAccountStatus: () => Promise<StripeAccountStatus>,
  doCustomerPurchaseCost: (cost: number) => Promise<StripeCustomerPurchaseCostResponse>,
};

function PublishPrice(props: Props) {
  const {
    fileMime,
    streamType,
    isMarkdownPost,
    // Purchase
    fiatPurchaseEnabled,
    fiatPurchaseFee,
    // Rental
    fiatRentalEnabled,
    fiatRentalFee,
    fiatRentalExpiration,
    // SDK-LBC
    paywall = PAYWALL.FREE,
    fee,
    restrictedToMemberships,
    chargesEnabled,
    updatePublishForm,
    doTipAccountStatus,
    doCustomerPurchaseCost,
    disabled,
  } = props;

  const [expanded, setExpanded] = usePersistedState('publish:price:extended', true);
  const [fiatAllowed, setFiatAllowed] = React.useState(true);

  const bankAccountNotFetched = chargesEnabled === undefined;
  const noBankAccount = !chargesEnabled && !bankAccountNotFetched;

  // If it's only restricted, the price can be added externally and they won't be able to change it
  const restrictedWithoutPrice = paywall === PAYWALL.FREE && restrictedToMemberships;

  function clamp(value, min, max) {
    return Math.min(Math.max(Number(value), min), max);
  }

  function sanitizeFee(name) {
    const feeLookup = {
      fiatPurchaseFee: fiatPurchaseFee,
      fiatRentalFee: fiatRentalFee,
    };

    const f = feeLookup[name];
    if (f && Number.isFinite(f.amount)) {
      updatePublishForm({
        [name]: {
          ...f,
          amount: clamp(f.amount.toFixed(2), FEE.MIN, FEE.MAX),
        },
      });
    }
  }

  function sanitizeDuration() {
    if (Number.isFinite(fiatRentalExpiration.value)) {
      updatePublishForm({
        fiatRentalExpiration: {
          ...fiatRentalExpiration,
          value: clamp(fiatRentalExpiration.value.toFixed(2), 1, 99999),
        },
      });
    }
  }

  function getBankAccountDriver() {
    return (
      <div className="publish-price__bank-driver">
        <I18nMessage
          tokens={{
            click_here_to_connect_a_bank_account: <ButtonStripeConnectAccount />,
          }}
        >
          %click_here_to_connect_a_bank_account% to enable purchasing and renting functionality.
        </I18nMessage>
      </div>
    );
  }

  function getRestrictionWarningRow() {
    return (
      <div className={classnames('publish-price__row', {})}>
        <div className="error__text">
          {__('You already have content restrictions enabled, disable them first in order to set a price.')}
        </div>
      </div>
    );
  }

  function getPaywallOptionsRow() {
    return (
      <div
        className={classnames('publish-price__row', {
          'publish-price__row--disabled': restrictedWithoutPrice,
        })}
      >
        <div className="publish-price__grp-1">
          <fieldset-section>
            <React.Fragment>
              <FormField
                type="radio"
                name="content_free"
                label={__('Free')}
                checked={paywall === PAYWALL.FREE}
                disabled={disabled}
                onChange={() => updatePublishForm({ paywall: PAYWALL.FREE })}
              />
              <FormField
                type="radio"
                name="content_fiat"
                label={`${__('Purchase / Rent')} \u{0024}`}
                checked={paywall === PAYWALL.FIAT}
                disabled={disabled || noBankAccount || !fiatAllowed}
                onChange={() => updatePublishForm({ paywall: PAYWALL.FIAT })}
              />
              {noBankAccount && getBankAccountDriver()}
              <FormField
                type="radio"
                name="content_sdk"
                label={<LbcSymbol prefix={__('Purchase with Credits')} />}
                checked={paywall === PAYWALL.SDK}
                disabled={disabled}
                onChange={() => updatePublishForm({ paywall: PAYWALL.SDK })}
              />
            </React.Fragment>
          </fieldset-section>
        </div>
      </div>
    );
  }

  function getTncRow() {
    return (
      <div
        className={classnames('publish-price__row', {
          'publish-price__row--indented': true,
        })}
      >
        <div className="publish-price__grp-1 publish-price__tnc">
          <I18nMessage
            tokens={{
              paid_content_terms_and_conditions: (
                <Button
                  button="link"
                  href="https://help.odysee.tv/category-monetization/"
                  label={__('paid-content terms and conditions')}
                />
              ),
            }}
          >
            By continuing, you accept the %paid_content_terms_and_conditions%.
          </I18nMessage>
        </div>
      </div>
    );
  }

  function getPurchaseRow() {
    return (
      <div
        className={classnames('publish-price__row', {
          'publish-price__row--disabled': noBankAccount || restrictedWithoutPrice,
          'publish-price__row--indented': true,
        })}
      >
        <div className="publish-price__grp-1">
          <FormField
            label={__('Purchase')}
            name="purchase"
            type="checkbox"
            checked={fiatPurchaseEnabled}
            onChange={() => updatePublishForm({ fiatPurchaseEnabled: !fiatPurchaseEnabled })}
          />
        </div>
        <div className={classnames('publish-price__grp-2', { 'publish-price__grp-2--disabled': !fiatPurchaseEnabled })}>
          <FormFieldPrice
            name="fiat_purchase_fee"
            min={1}
            price={fiatPurchaseFee}
            onChange={(fee) => updatePublishForm({ fiatPurchaseFee: fee })}
            onBlur={() => sanitizeFee('fiatPurchaseFee')}
            currencies={CURRENCY_OPTIONS}
          />
          <div className="publish-price__fees">
            <FeeBreakdown
              amount={fiatPurchaseFee.amount}
              currency={fiatPurchaseFee.currency}
              doCustomerPurchaseCost={doCustomerPurchaseCost}
            />
          </div>
        </div>
      </div>
    );
  }

  function getRentalRow() {
    return (
      <div
        className={classnames('publish-price__row', {
          'publish-price__row--disabled': noBankAccount || restrictedWithoutPrice,
          'publish-price__row--indented': true,
        })}
      >
        <div className="publish-price__grp-1">
          <FormField
            label={__('Rent')}
            name="rent"
            type="checkbox"
            checked={fiatRentalEnabled}
            onChange={() => updatePublishForm({ fiatRentalEnabled: !fiatRentalEnabled })}
          />
        </div>
        <div className={classnames('publish-price__grp-2', { 'publish-price__grp-2--disabled': !fiatRentalEnabled })}>
          <FormFieldPrice
            name="fiat_rental_fee"
            min={1}
            price={fiatRentalFee}
            onChange={(fee) => updatePublishForm({ fiatRentalFee: fee })}
            onBlur={() => sanitizeFee('fiatRentalFee')}
            currencies={CURRENCY_OPTIONS}
          />
          <FormFieldDurationCombo
            label={__('Duration')}
            name="fiat_rental_expiration"
            min={1}
            duration={fiatRentalExpiration}
            onChange={(duration) => updatePublishForm({ fiatRentalExpiration: duration })}
            onBlur={() => sanitizeDuration()}
            units={['months', 'weeks', 'days', 'hours']}
          />
          <div className="publish-price__fees">
            <FeeBreakdown
              amount={fiatRentalFee.amount}
              currency={fiatRentalFee.currency}
              doCustomerPurchaseCost={doCustomerPurchaseCost}
            />
          </div>
        </div>
      </div>
    );
  }

  function getLbcPurchaseRow() {
    return (
      <div
        className={classnames('publish-price__row', {
          'publish-price__row--disabled': restrictedWithoutPrice,
          'publish-price__row--indented': true,
        })}
      >
        <div className="publish-price__grp-1">
          <FormFieldPrice
            name="lbc_purchase_fee"
            min={1}
            price={fee}
            onChange={(newFee) => updatePublishForm({ fee: newFee })}
          />
          {fee && fee.currency !== 'LBC' && (
            <p className="publish-price__subtitle">
              {__(
                'All content fees are charged in LBRY Credits. For alternative payment methods, the number of LBRY Credits charged will be adjusted based on the value of LBRY Credits at the time of purchase.'
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  React.useEffect(() => {
    if (bankAccountNotFetched) {
      doTipAccountStatus();
    }
  }, [bankAccountNotFetched, doTipAccountStatus]);

  React.useEffect(() => {
    function isFiatWhitelistedFileType() {
      if (fileMime) {
        // fileMime: the current browsed/selected file (it's empty on edit, but can be changed)
        return fileMime.startsWith('audio') || fileMime.startsWith('video');
      } else if (streamType) {
        // streamType: the original type that we are editing from.
        return streamType === 'audio' || streamType === 'video' || streamType === 'document';
      }
      return false;
    }

    const isFiatAllowed = isMarkdownPost || isFiatWhitelistedFileType();
    setFiatAllowed(isFiatAllowed);

    if (paywall === PAYWALL.FIAT && !isFiatAllowed) {
      updatePublishForm({ paywall: PAYWALL.FREE });
    }
  }, [fileMime, paywall, isMarkdownPost, updatePublishForm, streamType]);

  return (
    <div className="publish-price">
      <h2 className="publish-price__title">{__('Price')}</h2>
      <Card
        className={classnames('card--enable-overflow card--publish-section card--additional-options', {
          'card--disabled': disabled,
        })}
        actions={
          <>
            {expanded && (
              <>
                {restrictedWithoutPrice && getRestrictionWarningRow()}
                {getPaywallOptionsRow()}
                {paywall === PAYWALL.FIAT && (
                  <>
                    {getPurchaseRow()}
                    {getRentalRow()}
                    {getTncRow()}
                  </>
                )}
                {paywall === PAYWALL.SDK && getLbcPurchaseRow()}
              </>
            )}
            <div className="publish-price__row">
              <Button
                label={__(expanded ? 'Hide' : 'Show')}
                button="link"
                onClick={() => setExpanded((prev) => !prev)}
              />
            </div>
          </>
        }
      />
    </div>
  );
}

export default PublishPrice;
