// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  accountStatus: ?StripeAccountStatus,
  doTipAccountStatus: (any) => void,
};

export default function WalletFiatBalance(props: Props) {
  const { accountStatus, doTipAccountStatus } = props;
  const { total_tipped: totalTippedAmount } = accountStatus || {};

  React.useEffect(() => {
    doTipAccountStatus();
  }, [doTipAccountStatus]);

  return (
    <Card
      title={<>Cash Balance</>}
      subtitle={__('You can view your balance and transaction history on Stripe from the Bank Accounts section.')}
      actions={
        <>
          <h2 className="section__title--small">
            ${totalTippedAmount ? (totalTippedAmount / 100).toFixed(2) : 0} {__('Total Received Tips')}
          </h2>

          <div className="section__actions">
            <Button
              button="secondary"
              label={__('Bank Accounts')}
              icon={ICONS.SETTINGS}
              navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`}
            />
            <Button
              button="secondary"
              label={__('Payment Methods')}
              icon={ICONS.SETTINGS}
              navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`}
            />
          </div>
        </>
      }
    />
  );
}
