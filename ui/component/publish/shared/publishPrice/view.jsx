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
import * as PAGES from 'constants/pages';
import { PAYWALL } from 'constants/publish';
import usePersistedState from 'effects/use-persisted-state';

const FEE = { MIN: 1, MAX: 999.99 };
const CURRENCY_OPTIONS = ['USD', 'EUR'];

type Props = {
  disabled: boolean,
  // --- redux ---
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

  const bankAccountNotFetched = chargesEnabled === undefined;
  const noBankAccount = !chargesEnabled && !bankAccountNotFetched;

  // If it's only restricted, the price can be added externally and they won't be able to change it
  const restrictedWithoutPrice = paywall === PAYWALL.FREE && restrictedToMemberships;

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
          amount: Math.min(Math.max(Number(f.amount.toFixed(2)), FEE.MIN), FEE.MAX),
        },
      });
    }
  }

  function getBankAccountDriver() {
    return (
      <div className="publish-price__bank-driver">
        <I18nMessage
          tokens={{
            connect_your_bank_account: (
              <Button
                label={__('Connect your bank account')}
                navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`}
                button="link"
              />
            ),
          }}
        >
          %connect_your_bank_account% to enable purchasing and renting functionality.
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
                disabled={disabled || noBankAccount}
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
