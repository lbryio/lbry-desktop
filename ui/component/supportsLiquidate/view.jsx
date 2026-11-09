// @flow
import * as ICONS from 'constants/icons';
import React, { useCallback, useEffect, useState } from 'react';
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
  metaData: any,
  handleClose: () => void,
  abandonSupportForClaim: (string, string, boolean | string, boolean) => any,
  abandonClaimError: ?string,
};

const SupportsLiquidate = (props: Props) => {
  const { claim, abandonSupportForClaim, handleClose, abandonClaimError } = props;
  const [previewBalance, setPreviewBalance] = useState(undefined);
  const [defaultValueAssigned, setDefaultValueAssigned] = useState(false);
  const [unlockTextAmount, setUnlockTextAmount] = useState('');
  const [error, setError] = useState(false);
  const initialMessage = __('How much would you like to unlock?');
  const [message, setMessage] = useState(initialMessage);
  const amount = Number(unlockTextAmount) || 0;
  const defaultValue = previewBalance ? previewBalance * 0.25 : 0;
  const keep =
    amount >= 0
      ? Boolean(previewBalance) && Number.parseFloat(String(Number(previewBalance) - amount)).toFixed(8)
      : Boolean(previewBalance) && Number.parseFloat(String(defaultValue * 3)).toFixed(8);
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

  const handleRangeChange = useCallback(
    (newValue) => {
      setUnlockTextAmount(String(newValue));
    },
    [setUnlockTextAmount]
  );

  const handleChangeUnlockText = useCallback(
    (newValue) => {
      // Get rid of all characters except digits, commas and periods.
      const onlyValidAmount = newValue.replace(/[^0-9.,]+/, '');
      setUnlockTextAmount(onlyValidAmount);
    },
    [setUnlockTextAmount]
  );

  const handleUnlockTextFocus = useCallback(() => {
    // Get rid of empty zero when user starts typing (small ux improvement)
    if (Number(unlockTextAmount) === 0) {
      setUnlockTextAmount('');
    }
  }, [unlockTextAmount, setUnlockTextAmount]);

  const handleUnlockTextBlur = useCallback(() => {
    if (!unlockTextAmount || isNaN(Number(unlockTextAmount))) {
      setUnlockTextAmount(previewBalance ? String(defaultValue) : '0');
    }
  }, [unlockTextAmount, setUnlockTextAmount, previewBalance, defaultValue]);

  useEffect(() => {
    if (defaultValueAssigned || !previewBalance || unlockTextAmount) {
      return;
    }
    setUnlockTextAmount(String(defaultValue));
    setDefaultValueAssigned(true);
  }, [
    defaultValue,
    defaultValueAssigned,
    previewBalance,
    unlockTextAmount,
    setUnlockTextAmount,
    setDefaultValueAssigned,
  ]);

  // Update message & error based on unlock amount.
  useEffect(() => {
    const unlockAmount = Number(unlockTextAmount);
    const previewBalanceNumber = Number(previewBalance);
    if (unlockTextAmount && isNaN(unlockAmount)) {
      setMessage(__('Amount must be a number'));
      setError(true);
    } else if (unlockAmount > previewBalanceNumber) {
      setMessage(__('Amount cannot be more than available'));
      setError(true);
    } else if (Math.abs(unlockAmount - previewBalanceNumber) <= Number.EPSILON) {
      setMessage(__(`She's about to close up the library!`));
      setError(false);
    } else if (unlockAmount > previewBalanceNumber / 2) {
      setMessage(__('Your content will do better with more staked on it'));
      setError(false);
    } else if (unlockAmount === 0) {
      setMessage(__('Amount cannot be zero'));
      setError(true);
    } else if (unlockAmount <= previewBalanceNumber / 2) {
      setMessage(__('A prudent choice'));
      setError(false);
    } else {
      setMessage(initialMessage);
      setError(false);
    }
  }, [initialMessage, unlockTextAmount, previewBalance, setMessage, setError]);

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
                learn_more: <Button button="link" label={__('Learn More')} href="https://lbry.com/faq/tipping" />,
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
                      value={amount}
                      onChange={(e) => handleRangeChange(e.target.value)}
                    />
                    <label className="range__label">
                      <span>0</span>
                      <span>{previewBalance / 2}</span>
                      <span>{previewBalance}</span>
                    </label>
                    <FormField
                      type="text"
                      value={unlockTextAmount}
                      helper={message}
                      onFocus={handleUnlockTextFocus}
                      onChange={(e) => handleChangeUnlockText(e.target.value)}
                      onBlur={handleUnlockTextBlur}
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
