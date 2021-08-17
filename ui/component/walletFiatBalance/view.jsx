// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';

type Props = {
  accountDetails: any,
};

const WalletBalance = (props: Props) => {
  const {
    accountDetails,
  } = props;

  return (
    <>{<Card
      title={<><Icon size={18} icon={ICONS.FINANCE} />{(accountDetails && ((accountDetails.total_received_unpaid - accountDetails.total_paid_out) / 100)) || 0} USD</>}
      subtitle={accountDetails && accountDetails.total_received_unpaid > 0 &&
          <I18nMessage>
            This is your pending balance that will be automatically sent to your bank account
          </I18nMessage>
      }
      actions={
        <>
          <h2 className="section__title--small">
            ${(accountDetails && (accountDetails.total_received_unpaid / 100)) || 0} Total Received Tips
          </h2>

          <h2 className="section__title--small">
            ${(accountDetails && (accountDetails.total_paid_out / 100)) || 0}  Withdrawn
          </h2>

          <div className="section__actions">
            <Button button="secondary" label={__('Account Configuration')} icon={ICONS.SETTINGS} navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`} />
          </div>
        </>
      }
    />}</>
  );
};

export default WalletBalance;
