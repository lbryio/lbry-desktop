// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, useState } from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import ErrorText from 'component/common/error-text';

type Props = {
  balance: number,
  totalBalance: number,
  claimsBalance: number,
  supportsBalance: number,
  tipsBalance: number,
  claim: any,
  handleClose: () => void,
  abandonSupportForClaim: (string, string, boolean | string, boolean) => any,
  abandonClaimError: ?string,
};

const SupportsLiquidate = (props: Props) => {
  const { claim, abandonSupportForClaim, handleClose, abandonClaimError } = props;
  const [previewBalance, setPreviewBalance] = useState(undefined);
  const [amount, setAmount] = useState(-1);
  const [error, setError] = useState(false);
  const initialMessage = __('How much would you like to unlock?');
  const [message, setMessage] = useState(initialMessage);
  const keep =
    amount >= 0
      ? Boolean(previewBalance) && Number.parseFloat(String(Number(previewBalance) - Number(amount))).toFixed(8)
      : Boolean(previewBalance) && Number.parseFloat(String((Number(previewBalance) / 4) * 3)).toFixed(8); // default unlock 25%
  const claimId = claim && claim.claim_id;
  const type = claim.value_type;

  useEffect(() => {
    if (claimId && abandonSupportForClaim) {
      abandonSupportForClaim(claimId, type, false, true).then((r) => {
        setPreviewBalance(r.total_input);
      });
    }
  }, [abandonSupportForClaim, claimId, type, setPreviewBalance]);

  function handleSubmit() {
    abandonSupportForClaim(claimId, type, keep, false).then((r) => {
      if (r) {
        handleClose();
      }
    });
  }

  function handleChange(a) {
    if (a === undefined || isNaN(Number(a))) {
      setMessage(__('Amount must be a number'));
      setError(true);
      setAmount(0);
    } else if (a === '') {
      setAmount(0);
      setError(true);
      setMessage(__('Amount cannot be blank'));
    } else if (Number(a) > Number(previewBalance)) {
      setMessage(__('Amount cannot be more than available'));
      setError(false);
    } else if (Number(a) === Number(previewBalance)) {
      setMessage(__(`She's about to close up the library!`));
      setAmount(a);
      setError(false);
    } else if (Number(a) > Number(previewBalance) / 2) {
      setMessage(__('Your content will do better with more staked on it'));
      setAmount(a);
      setError(false);
    } else if (Number(a) === 0) {
      setMessage(__('Amount cannot be zero'));
      setAmount(0);
      setError(true);
    } else if (Number(a) <= Number(previewBalance) / 2) {
      setMessage(__('A prudent choice'));
      setAmount(Number(a));
      setError(false);
    } else {
      setMessage(initialMessage);
      setAmount(a);
      setError(false);
    }
  }

  return (
    <Card
      icon={ICONS.UNLOCK}
      title={__('Unlock tips')}
      subtitle={
        <>
          <p>
            {__('You can unlock all or some of these LBRY Credits at any time.')}{' '}
            {__('Keeping it locked improves the trust and discoverability of your content.')}
          </p>
          <p>
            <I18nMessage
              tokens={{
                learn_more: (
                  <Button
                    button="link"
                    label={__('Learn More')}
                    href="https://odysee.com/@OdyseeHelp:b/Monetization-of-Content:3"
                  />
                ),
              }}
            >
              It's usually only worth unlocking what you intend to use immediately. %learn_more%
            </I18nMessage>
          </p>
        </>
      }
      actions={
        <React.Fragment>
          {abandonClaimError ? (
            <div className="error__wrapper--no-overflow">
              <ErrorText>{abandonClaimError}</ErrorText>
            </div>
          ) : (
            <>
              <div className="section">
                <I18nMessage
                  tokens={{
                    amount: (
                      <strong>
                        <CreditAmount amount={Number(previewBalance)} precision={8} />
                      </strong>
                    ),
                  }}
                >
                  %amount% available to unlock
                </I18nMessage>
              </div>
              <div className="section">
                {previewBalance === 0 && <p>{__('No unlockable tips available')}</p>}
                {previewBalance === undefined && <p>{__('Loading...')}</p>}
                {previewBalance && (
                  <Form onSubmit={handleSubmit}>
                    <label htmlFor="supports_liquidate_range">{__('Amount to unlock')}</label>
                    <FormField
                      name="supports_liquidate_range"
                      type={'range'}
                      min={0}
                      step={0.01}
                      max={previewBalance}
                      value={Number(amount) >= 0 ? amount : previewBalance / 4} // by default, set it to 25% of available
                      onChange={(e) => handleChange(e.target.value)}
                    />
                    <label className="range__label">
                      <span>0</span>
                      <span>{previewBalance / 2}</span>
                      <span>{previewBalance}</span>
                    </label>
                    <FormField
                      type="text"
                      value={amount >= 0 ? amount || '' : previewBalance && previewBalance / 4}
                      helper={message}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                  </Form>
                )}
              </div>
            </>
          )}
          <div className="section__actions">
            <Button
              disabled={error}
              button="primary"
              onClick={abandonClaimError ? handleClose : handleSubmit}
              label={abandonClaimError ? __('Done') : __('Unlock')}
            />
          </div>
        </React.Fragment>
      }
    />
  );
};

export default SupportsLiquidate;
