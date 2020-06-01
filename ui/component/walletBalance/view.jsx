// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import Icon from 'component/common/icon';
import HelpLink from 'component/common/help-link';
import Card from 'component/common/card';

type Props = {
  balance: number,
  totalBalance: number,
  claimsBalance: number,
  supportsBalance: number,
  tipsBalance: number,
  doOpenModal: string => void,
  hasSynced: boolean,
};

const WalletBalance = (props: Props) => {
  const { balance, claimsBalance, supportsBalance, tipsBalance, doOpenModal, hasSynced } = props;

  return (
    <React.Fragment>
      <section className="columns">
        <Card
          title={
            <span>
              {(balance || balance === 0) && (
                <CreditAmount badge={false} amount={balance} precision={8} showLBC={false} />
              )}{' '}
              <span className="section__title--small">LBC</span>
            </span>
          }
          subtitle={__('Available Balance')}
          actions={
            <div className="section__actions">
              <Button button="primary" label={__('Buy')} icon={ICONS.BUY} navigate={`/$/${PAGES.BUY}`} />
              <Button
                button="secondary"
                label={__('Receive')}
                icon={ICONS.RECEIVE}
                onClick={() => doOpenModal(MODALS.WALLET_RECEIVE)}
              />
              <Button
                button="secondary"
                label={__('Send')}
                icon={ICONS.SEND}
                onClick={() => doOpenModal(MODALS.WALLET_SEND)}
              />
            </div>
          }
        />
        <div>
          <React.Fragment>
            {/* @if TARGET='app' */}
            {hasSynced ? (
              <div className="section">
                <div className="section__flex">
                  <Icon sectionIcon icon={ICONS.LOCK} />
                  <h2 className="section__title--small">
                    {__('A backup of your wallet is synced with lbry.tv.')}
                    <HelpLink href="https://lbry.com/faq/account-sync" />
                  </h2>
                </div>
              </div>
            ) : (
              <div className="section">
                <div className="section__flex">
                  <Icon sectionIcon icon={ICONS.UNLOCK} />
                  <h2 className="section__title--small">
                    {__(
                      'Your wallet is not currently synced with lbry.tv. You are in control of backing up your wallet.'
                    )}
                    <HelpLink navigate={`/$/${PAGES.BACKUP}`} />
                  </h2>
                </div>
              </div>
            )}
            {/* @endif */}

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
          </React.Fragment>
        </div>
      </section>
    </React.Fragment>
  );
};

export default WalletBalance;
