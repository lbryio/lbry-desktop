// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Icon from 'component/common/icon';

type Props = {
  accountTotals: { total_received_unpaid: number, total_paid_out: number },
  doTipAccountStatus: (any) => void,
};

export default function WalletFiatBalance(props: Props) {
  const { accountTotals, doTipAccountStatus } = props;
  const { total_received_unpaid: unpaidBalance, total_paid_out: paidOutBalance } = accountTotals || {};

  React.useEffect(() => {
    doTipAccountStatus();
  }, [doTipAccountStatus]);

  return (
    <Card
      title={
        <>
          <Icon size={18} icon={ICONS.FINANCE} />
          {unpaidBalance && paidOutBalance ? (unpaidBalance - paidOutBalance) / 100 : 0} USD
        </>
      }
      subtitle={
        unpaidBalance && unpaidBalance > 0
          ? __('This is your pending balance that will be automatically sent to your bank account.')
          : __('When you begin to receive tips your balance will be updated here.')
      }
      actions={
        <>
          <h2 className="section__title--small">
            ${unpaidBalance ? unpaidBalance / 100 : 0} {__('Total Received Tips')}
          </h2>

          {/* withdraw amount is usuallty incorrect due to chargebacks / currency conversion issues
          <h2 className="section__title--small">
            ${paidOutBalance ? paidOutBalance / 100 : 0} {__('Withdrawn')}
          </h2> */}

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
