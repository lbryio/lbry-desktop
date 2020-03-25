// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, useState } from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import Icon from 'component/common/icon';
import { Form, FormField } from 'component/common/form';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

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
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(__('Amount to unlock'));
  const keep =
    previewBalance && amount && Number(amount) < previewBalance
      ? Number.parseFloat(String(previewBalance - Number(amount))).toFixed(8)
      : false;
  const claimId = claim && claim.claim_id;
  const type = claim.value_type;

  useEffect(() => {
    if (claimId && abandonSupportForClaim) {
      abandonSupportForClaim(claimId, type, false, true).then(r => {
        setPreviewBalance(r.total_input);
      });
    }
  }, [abandonSupportForClaim, claimId, type, setPreviewBalance]);

  function handleSubmit() {
    abandonSupportForClaim(claimId, type, keep, false).then(r => {
      if (r) {
        handleClose();
      }
    });
  }

  function handleChange(a) {
    if (a === undefined || isNaN(Number(a))) {
      setMessage(__('Amount must be a number'));
      setError(true);
      setAmount('');
    } else if (a === '') {
      setAmount('');
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
    } else if (a === '0') {
      setMessage(__('Amount cannot be zero'));
      setAmount(a);
      setError(true);
    } else {
      setMessage(__('Amount to unlock'));
      setAmount(a);
      setError(false);
    }
  }

  return (
    <Card
      title={__('Unlock Tips')}
      subtitle={
        abandonClaimError ? (
          <div className="section__flex">
            <div>
              <h2 className="section__title--small">{__('Paging Comrade Yrbl, there was an error.')}</h2>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="section__flex">
              <Icon sectionIcon icon={ICONS.LOCK} />
              <div>
                <h2 className="section__title--small">
                  <strong>
                    <CreditAmount badge={false} amount={Number(previewBalance)} precision={8} />
                  </strong>{' '}
                  {__('available to unlock.')}
                </h2>
              </div>
            </div>
            <p>
              <I18nMessage
                tokens={{
                  learn_more: <Button button="link" label={__('Learn More')} href="https://lbry.com/faq/tipping" />,
                }}
              >
                You can unlock all or some of the locked LBC. The more you unlock, the less trusted your content is.
                %learn_more%
              </I18nMessage>
            </p>
          </React.Fragment>
        )
      }
      actions={
        <React.Fragment>
          <div className="section">
            {abandonClaimError ? (
              <>
                <span>{__('%message%', { message: abandonClaimError })}</span>
                <div className="section__actions">
                  <Button disabled={error} button="primary" onClick={handleClose} label={__('Done')} />
                </div>
              </>
            ) : (
              <>
                {previewBalance && (
                  <Form onSubmit={handleSubmit}>
                    <label htmlFor="supports_liquidate_range">{__('Amount')}</label>
                    <FormField
                      name="supports_liquidate_range"
                      type={'range'}
                      min={0}
                      step={0.01}
                      max={previewBalance} // times 100 to so we're more granular than whole numbers.
                      value={Number(amount) || previewBalance / 4} // by default, set it to 25% of available
                      onChange={e => handleChange(e.target.value)}
                    />
                    <label className="range__label">
                      <span>0</span>
                      <span>{previewBalance / 2}</span>
                      <span>{previewBalance}</span>
                    </label>
                    <div className="section">
                      <FormField
                        type="text"
                        value={amount || (previewBalance && previewBalance / 4)}
                        helper={message}
                        onChange={e => handleChange(e.target.value)}
                      />
                    </div>
                    <div className="section__actions">
                      <Button disabled={error} button="primary" type="submit" label={__('Unlock')} />
                    </div>
                  </Form>
                )}
                {previewBalance === 0 && <p>{__('No unlockable tips available')}</p>}
                {previewBalance === undefined && <p>{__('Loading...')}</p>}
              </>
            )}
          </div>
        </React.Fragment>
      }
    />
  );
};

export default SupportsLiquidate;
