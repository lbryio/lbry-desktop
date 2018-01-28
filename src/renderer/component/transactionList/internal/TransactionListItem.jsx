import React from 'react';
import LinkTransaction from 'component/linkTransaction';
import { CreditAmount } from 'component/common';
import DateTime from 'component/dateTime';
import Link from 'component/link';
import { buildURI } from 'lbry-redux';
import * as txnTypes from 'constants/transaction_types';

class TransactionListItem extends React.PureComponent {
  getLink(type) {
    if (type === txnTypes.TIP) {
      return (
        <Link onClick={this.abandonClaim.bind(this)} icon="icon-unlock-alt" title={__('Unlock')} />
      );
    }
    return <Link onClick={this.abandonClaim.bind(this)} icon="icon-trash" title={__('Revoke')} />;
  }

  abandonClaim() {
    const { txid, nout } = this.props.transaction;

    this.props.revokeClaim(txid, nout);
  }

  capitalize(string) {
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
          {date ? (
            <div>
              <DateTime date={date} show={DateTime.SHOW_DATE} formatOptions={dateFormat} />
              <div className="meta">
                <DateTime date={date} show={DateTime.SHOW_TIME} />
              </div>
            </div>
          ) : (
            <span className="empty">{__('Pending')}</span>
          )}
        </td>
        <td>
          <CreditAmount amount={amount} look="plain" label={false} showPlus precision={8} />
          <br />
          {fee !== 0 && <CreditAmount amount={fee} look="fee" label={false} precision={8} />}
        </td>
        <td>
          {this.capitalize(type)} {isRevokeable && this.getLink(type)}
        </td>
        <td>
          {reward && <Link navigate="/rewards">{__('Reward: %s', reward.reward_title)}</Link>}
          {name &&
            claimId && (
              <Link
                className="button-text"
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
      </tr>
    );
  }
}

export default TransactionListItem;
