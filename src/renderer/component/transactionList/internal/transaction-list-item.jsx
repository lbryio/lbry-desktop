// @flow
import React from 'react';
import ButtonTransaction from 'component/common/transaction-link';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';
import * as txnTypes from 'constants/transaction_types';
import * as ICONS from 'constants/icons';
import type { Transaction } from '../view';

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
    if (type === txnTypes.TIP) {
      return <Button icon={ICONS.UNLOCK} onClick={this.abandonClaim} title={__('Unlock Tip')} />;
    }
    return <Button icon={ICONS.TRASH} onClick={this.abandonClaim} title={__('Abandon Claim')} />;
  }

  abandonClaim() {
    const { txid, nout } = this.props.transaction;

    this.props.revokeClaim(txid, nout);
  }

  capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

  render() {
    const { reward, transaction, isRevokeable } = this.props;
    const { amount, claim_id: claimId, claim_name: name, date, fee, txid, type } = transaction;

    const dateFormat = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    return (
      <tr>
        <td>
          <CreditAmount inheritStyle showPlus amount={amount} precision={8} />
          <br />

          {fee !== 0 && (
            <span className="table__item-label">
              <CreditAmount inheritStyle fee amount={fee} precision={8} />
            </span>
          )}
        </td>
        <td className="table__item--actionable">
          <span>{this.capitalize(type)}</span> {isRevokeable && this.getLink(type)}
        </td>
        <td className="table__item--actionable">
          {reward && <span>{reward.reward_title}</span>}
          {name &&
            claimId && (
              <Button
                tourniquet
                button="link"
                navigate="/show"
                navigateParams={{ uri: buildURI({ claimName: name, claimId }) }}
              >
                {name}
              </Button>
            )}
        </td>

        <td>
          <ButtonTransaction id={txid} />
        </td>
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
      </tr>
    );
  }
}

export default TransactionListItem;
