// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import { buildURI } from 'util/lbryURI';
import BidHelpText from 'component/common/bid-help-text';
import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';

type Props = {
  params: any,
  bidError: ?string,
  onChange: () => void,
  // -- redux --
  balance: number,
  isResolvingUri: boolean,
  amountNeededForTakeover: number,
  doResolveUri: (uri: string, cached: boolean) => void,
};

function PublishName(props: Props) {
  const { params, bidError, onChange, isResolvingUri, amountNeededForTakeover, doResolveUri } = props;
  const { name, bid } = params;

  React.useEffect(() => {
    if (name) doResolveUri(buildURI({ streamName: name }), true);
  }, [doResolveUri, name]);

  return (
    <Card
      actions={
        <FormField
          className="form-field--price-amount"
          type="number"
          name="content_bid"
          step="any"
          min="0.0"
          placeholder={0.1}
          label={<LbcSymbol postfix={__('Deposit')} size={14} />}
          value={bid}
          error={bidError}
          onChange={onChange}
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
