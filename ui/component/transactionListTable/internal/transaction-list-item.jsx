// @flow
import * as TXN_TYPES from 'constants/transaction_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import ButtonTransaction from 'component/common/transaction-link';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import { buildURI, parseURI } from 'lbry-redux';

type Props = {
  transaction: Transaction,
  revokeClaim: (string, number) => void,
  isRevokeable: boolean,
  reward: ?{
    reward_title: string,
  },
};

class TransactionListItem extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).abandonClaim = this.abandonClaim.bind(this);
  }

  getLink(type: string) {
    if (type === TXN_TYPES.TIP) {
      return <Button button="secondary" icon={ICONS.UNLOCK} onClick={this.abandonClaim} title={__('Unlock Tip')} />;
    }
    const abandonTitle = type === TXN_TYPES.SUPPORT ? 'Abandon Support' : 'Abandon Claim';
    return <Button button="secondary" icon={ICONS.DELETE} onClick={this.abandonClaim} title={__(abandonTitle)} />;
  }

  abandonClaim() {
    const { txid, nout } = this.props.transaction;

    this.props.revokeClaim(txid, nout);
  }

  capitalize = (string: ?string) => string && string.charAt(0).toUpperCase() + string.slice(1);

  render() {
    const { reward, transaction, isRevokeable } = this.props;
    const { amount, claim_id: claimId, claim_name: name, date, fee, txid, type } = transaction;

    // Ensure the claim name exists and is valid
    let uri;
    let claimName;
    try {
      if (name.startsWith('@')) {
        ({ claimName } = parseURI(name));
        uri = buildURI({ channelName: claimName, channelClaimId: claimId });
      } else {
        ({ claimName } = parseURI(name));
        uri = buildURI({ streamName: claimName, streamClaimId: claimId });
      }
    } catch (e) {}

    const dateFormat = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    const forClaim = name && claimId;

    return (
      <tr>
        <td>
          {date ? (
            <div>
              <DateTime date={date} show={DateTime.SHOW_DATE} formatOptions={dateFormat} />
              <div className="table__item-label">
                <DateTime date={date} show={DateTime.SHOW_TIME} />
              </div>
            </div>
          ) : (
            <span className="empty">{__('Pending')}</span>
          )}
        </td>
        <td className="table__item--actionable">
          <span>{this.capitalize(type)}</span> {isRevokeable && this.getLink(type)}
        </td>
        <td>
          {forClaim && <Button button="link" navigate={uri} label={claimName} />}
          {!forClaim && reward && <span>{reward.reward_title}</span>}
        </td>

        <td>
          <ButtonTransaction id={txid} />
        </td>
        <td className="table__item--align-right">
          <CreditAmount badge={false} showPlus amount={amount} precision={8} />
          <br />

          {fee !== 0 && (
            <span className="table__item-label">
              <CreditAmount badge={false} fee amount={fee} precision={8} />
            </span>
          )}
        </td>
      </tr>
    );
  }
}

export default TransactionListItem;
