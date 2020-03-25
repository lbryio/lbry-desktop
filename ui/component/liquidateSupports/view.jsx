// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, useState } from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import Icon from 'component/common/icon';
import { Form, FormField } from 'component/common/form';
import Card from 'component/common/card';

type Props = {
  balance: number,
  totalBalance: number,
  claimsBalance: number,
  supportsBalance: number,
  tipsBalance: number,
  claim: any,
  metaData: any,
  handleClose: () => void,
  abandonSupportForClaim: (string, boolean | string, boolean) => any,
};

const LiquidateSupports = (props: Props) => {
  const { claim, abandonSupportForClaim, handleClose } = props;
  const [previewBalance, setPreviewBalance] = useState(1);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('Amount to unlock');
  const keep =
    Number(amount) < previewBalance ? Number.parseFloat(String(previewBalance - Number(amount))).toFixed(8) : false;
  const claimId = claim && claim.claim_id;

  const MESSAGE_NUMBER = __('Amount must be a number');
  const MESSAGE_BLANK = __('Amount cannot be blank');
  const MESSAGE_STAKED = __('Your content will do better with more staked on it');
  const MESSAGE_MAX = __('Cannot set more than maximum');
  const MESSAGE_ZERO = __('Amount cannot be zero');
  const MESSAGE_DEFAULT = __('Amount to unlock');
  useEffect(() => {
    if (claimId && abandonSupportForClaim) {
      abandonSupportForClaim(claimId, false, true).then(r => {
        setPreviewBalance(r.total_input);
      });
    }
  }, [abandonSupportForClaim, claimId, setPreviewBalance]);

  function handleSubmit() {
    abandonSupportForClaim(claimId, keep, false);
    handleClose();
  }

  function handleChange(a) {
    if (a === undefined || isNaN(Number(a))) {
      setMessage(MESSAGE_NUMBER);
      setError(true);
      setAmount('');
    } else if (a === '') {
      setAmount('');
      setError(true);
      setMessage(MESSAGE_BLANK);
    } else if (Number(a) > previewBalance) {
      setMessage(MESSAGE_MAX);
      setError(false);
    } else if (Number(a) > previewBalance / 2) {
      setMessage(MESSAGE_STAKED);
      setAmount(a);
      setError(false);
    } else if (a === '0') {
      setMessage(MESSAGE_ZERO);
      setAmount(a);
      setError(true);
    } else {
      setMessage(MESSAGE_DEFAULT);
      setAmount(a);
      setError(false);
    }
  }

  return (
    <Card
      title={__('Unlock Tips')}
      subtitle={
        <React.Fragment>
          <div className="section__flex">
            <Icon sectionIcon icon={ICONS.LOCK} />
            <div>
              <h2 className="section__title--small">
                <strong>
                  <CreditAmount badge={false} amount={previewBalance || '...'} precision={2} />
                </strong>{' '}
                {__('available to liquidate.')}
              </h2>
            </div>
          </div>
          <p>
            You can unlock all or some of total supports. This will free up LBC, but reduce content standings. Fees
            apply.
          </p>
        </React.Fragment>
      }
      actions={
        <React.Fragment>
          <div className="section">
            <Form onSubmit={handleSubmit}>
              <FormField
                label={'Liquidate Amount'}
                type={'range'}
                min={0}
                max={previewBalance * 100} // times 100 to so we're more granular than whole numbers.
                value={Number(amount) * 100 || (previewBalance * 100) / 4} // by default, set it to 25% of available
                onChange={e => handleChange(String(e.target.value / 100))}
              />
              <FormField
                type="text"
                value={typeof amount === 'string' ? amount : previewBalance && previewBalance / 4}
                helper={message}
                onChange={e => handleChange(e.target.value)}
              />
              <div className="section__actions">
                <Button disabled={error} button="primary" type="submit" label={__('Liquidate')} />
              </div>
            </Form>
          </div>
        </React.Fragment>
      }
    />
  );
};

export default LiquidateSupports;
