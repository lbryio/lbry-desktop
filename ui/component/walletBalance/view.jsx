// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import Icon from 'component/common/icon';

type Props = {
  balance: number,
  totalBalance: number,
  claimsBalance: number,
  supportsBalance: number,
  tipsBalance: number,
  doOpenModal: string => void,
};

const WalletBalance = (props: Props) => {
  const { balance, claimsBalance, supportsBalance, tipsBalance, doOpenModal } = props;

  return (
    <React.Fragment>
      <section className="section__flex-wrap">
        <div>
          <h2 className="section__title">{__('Available Balance')}</h2>
          <span className="section__title--large">
            {(balance || balance === 0) && <CreditAmount badge={false} amount={balance} precision={8} />}
          </span>

          <div className="section__actions">
            <Button button="primary" label={__('Your Address')} onClick={() => doOpenModal(MODALS.WALLET_RECEIVE)} />
            <Button
              button="secondary"
              icon={ICONS.SEND}
              label={__('Send Credits')}
              onClick={() => doOpenModal(MODALS.WALLET_SEND)}
            />
          </div>
        </div>

        <div>
          <div className="section">
            <div className="section__flex">
              <Icon sectionIcon icon={ICONS.TIP} />
              <h2 className="section__title--small">
                <strong>
                  <CreditAmount badge={false} amount={tipsBalance} precision={8} />
                </strong>{' '}
                {__('earned and bound in tips')}
              </h2>
            </div>
          </div>

          <div className="section">
            <div className="section__flex">
              <Icon sectionIcon icon={ICONS.LOCK} />
              <div>
                <h2 className="section__title--small">
                  <strong>
                    <CreditAmount badge={false} amount={claimsBalance + supportsBalance} precision={8} />
                  </strong>{' '}
                  {__('currently staked')}
                </h2>
                <div className="section__subtitle">
                  <dl>
                    <dt>{__('... in your publishes')}</dt>
                    <dd>
                      <CreditAmount badge={false} amount={claimsBalance} precision={8} />
                    </dd>

                    <dt>{__('... in your supports')}</dt>
                    <dd>
                      <CreditAmount badge={false} amount={supportsBalance} precision={8} />
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default WalletBalance;
