// @flow
import { MINIMUM_PUBLISH_BID, ESTIMATED_FEE } from 'constants/claim';
import React, { useState, useEffect } from 'react';
import { FormField } from 'component/common/form';
import BidHelpText from './bid-help-text';
import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';

type Props = {
  name: string,
  bid: number,
  balance: number,
  myClaimForUri: ?StreamClaim,
  isResolvingUri: boolean,
  amountNeededForTakeover: number,
  updatePublishForm: ({}) => void,
};

function PublishName(props: Props) {
  const { name, myClaimForUri, bid, isResolvingUri, amountNeededForTakeover, updatePublishForm, balance } = props;
  const [bidError, setBidError] = useState(undefined);
  const previousBidAmount = myClaimForUri && Number(myClaimForUri.amount);

  useEffect(() => {
    const totalAvailableBidAmount = previousBidAmount ? previousBidAmount + balance : balance;

    let bidError;
    if (bid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (bid < MINIMUM_PUBLISH_BID) {
      bidError = __('Your deposit must be higher');
    } else if (totalAvailableBidAmount < bid) {
      bidError = __('Deposit cannot be higher than your available balance: %balance%', {
        balance: totalAvailableBidAmount,
      });
    } else if (totalAvailableBidAmount - bid < ESTIMATED_FEE) {
      bidError = __('Please decrease your deposit to account for transaction fees');
    }

    setBidError(bidError);
    updatePublishForm({ bidError: bidError });
  }, [bid, previousBidAmount, balance, updatePublishForm]);

  return (
    <Card
      actions={
        <FormField
          type="number"
          name="content_bid"
          min="0"
          step="any"
          placeholder="0.123"
          className="form-field--price-amount"
          label={<LbcSymbol postfix={__('Deposit')} size={12} />}
          value={bid}
          error={bidError}
          disabled={!name}
          onChange={(event) => updatePublishForm({ bid: parseFloat(event.target.value) })}
          onWheel={(e) => e.stopPropagation()}
          helper={
            <>
              <BidHelpText
                uri={'lbry://' + name}
                amountNeededForTakeover={amountNeededForTakeover}
                isResolvingUri={isResolvingUri}
              />
              <WalletSpendableBalanceHelp inline />
            </>
          }
        />
      }
    />
  );
}

export default PublishName;
