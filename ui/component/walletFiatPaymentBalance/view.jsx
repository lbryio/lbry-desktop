// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import HelpLink from 'component/common/help-link';
import Card from 'component/common/card';
import Icon from 'component/common/icon';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import { formatNumberWithCommas } from 'util/number';

type Props = {
  totalTippedAmount: number,
  accountDetails: any,
  transactions: any,
};



const WalletBalance = (props: Props) => {
  const {
    accountDetails,
    totalTippedAmount,
    transactions,
  } = props;

  const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const [totalCreatorsSupported, setTotalCreatorsSupported] = React.useState(false);

  // calculate how many unique users tipped
  React.useEffect(() => {
    if(transactions){
      let channelNames = []

      for(const transaction of transactions){
        channelNames.push(transaction.channel_name)
        console.log(transaction.channel_name);
      }

      let unique = [...new Set(channelNames)];
      setTotalCreatorsSupported(unique.length);
    }
  }, [transactions]);

  return (
    <>{1 == 1 && <Card
      title={<><Icon size="18" icon={ICONS.FINANCE} />{totalTippedAmount} USD</>}
      subtitle={
          <I18nMessage>
            The total amount you have tipped to different creators
          </I18nMessage>
      }
      actions={
        <>
          <h2 className="section__title--small">
            {transactions && transactions.length} Total Tips
          </h2>

          <h2 className="section__title--small">
            {totalCreatorsSupported || 0} Creators Supported
          </h2>

          <div className="section__actions">
            <Button button="secondary" label={__('Manage Cards')} icon={ICONS.SETTINGS} navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} />
          </div>
        </>
      }
    />}</>
  );
};

export default WalletBalance;
