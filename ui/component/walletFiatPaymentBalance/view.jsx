// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  totalTippedAmount: number,
  accountDetails: any,
  transactions: any,
};

const WalletBalance = (props: Props) => {
  const {
    // accountDetails,
    transactions,
  } = props;

  // let cardDetails = {
  //   brand: card.brand,
  //   expiryYear: card.exp_year,
  //   expiryMonth: card.exp_month,
  //   lastFour: card.last4,
  //   topOfDisplay: topOfDisplay,
  //   bottomOfDisplay: bottomOfDisplay,
  // };

  // const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const [totalCreatorsSupported, setTotalCreatorsSupported] = React.useState(false);

  // calculate how many unique users tipped
  React.useEffect(() => {
    if (transactions) {
      let channelNames = [];

      for (const transaction of transactions) {
        channelNames.push(transaction.channel_name);
      }

      let unique = [...new Set(channelNames)];
      setTotalCreatorsSupported(unique.length);
    }
  }, [transactions]);

  return (
    <>{<Card
      // TODO: implement hasActiveCard and show the current card the user would charge to
      // subtitle={hasActiveCard && <h2>Hello</h2>
      //   // <Plastic
      //   //   type={userCardDetails.brand}
      //   //   name={userCardDetails.topOfDisplay + ' ' + userCardDetails.bottomOfDisplay}
      //   //   expiry={userCardDetails.expiryMonth + '/' + userCardDetails.expiryYear}
      //   //   number={'____________' + userCardDetails.lastFour}
      //   // />
      // }
      actions={
        <>
          <h2 className="section__title--small">
            {(transactions && transactions.length) || 0} Total Tips
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
