// @flow
import React from 'react';
import LinkTransaction from 'component/common/transaction-link';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import Link from 'component/link';
import { buildURI } from 'lbryURI';
import * as txnTypes from 'constants/transaction_types';
import type { Transaction } from '../view';

type Props = {
  transaction: Transaction,
  revokeClaim: (string, number) => void,
  isRevokeable: boolean,
  reward: ?{
    reward_title: string
  }
}

class TransactionListItem extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).abandonClaim = this.abandonClaim.bind(this);
  }

  abandonClaim() {
    const { txid, nout } = this.props.transaction;

    this.props.revokeClaim(txid, nout);
  }

  getLink(type: string) {
    if (type === txnTypes.TIP) {
      return (
        <Link onClick={this.abandonClaim} label={__('Unlock Tip')} />
      );
    }
    return <Link onClick={this.abandonClaim} label={__('Abandon Claim')} />;
  }

  capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const { reward, transaction, isRevokeable } = this.props;
    const {
      amount,
      claim_id: claimId,
      claim_name: name,
      date,
      fee,
      txid,
      type,
      nout,
    } = transaction;

    const dateFormat = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    return (
      <tr>
        <td>
          <CreditAmount amount={amount} plain showPlus precision={8} />
          <br />

          {fee !== 0 && (
            <span className="table__item-label">
              <CreditAmount plain fee amount={fee} precision={8} />
            </span>
          )}
        </td>
        <td>
          <span>{this.capitalize(type)}</span> {isRevokeable && this.getLink(type)}
        </td>
        <td>
          {reward && reward.reward_title}
          {name && claimId && (
            <Link
              fakeLink
              navigate="/show"
              navigateParams={{ uri: buildURI({ name, claimId }) }}
            >
              {name}
            </Link>
          )}
        </td>

        <td>
          <LinkTransaction id={txid} />
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
