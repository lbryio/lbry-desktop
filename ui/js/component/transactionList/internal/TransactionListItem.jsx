import React from "react";
import LinkTransaction from "component/linkTransaction";
import { CreditAmount } from "component/common";
import DateTime from "component/dateTime";
import Link from "component/link";
import lbryuri from "lbryuri";

class TransactionListItem extends React.PureComponent {
  abandonClaim(abandonData) {
    this.props.revokeClaim(abandonData);
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

    const abandonData = {
      name: name,
      claimId: claimId,
      txid: txid,
      nout: nout,
    };

    const dateFormat = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return (
      <tr>
        <td>
          {date
            ? <div>
                <DateTime
                  date={date}
                  show={DateTime.SHOW_DATE}
                  formatOptions={dateFormat}
                />
                <div className="meta">
                  <DateTime date={date} show={DateTime.SHOW_TIME} />
                </div>
              </div>
            : <span className="empty">
                {__("(Transaction pending)")}
              </span>}
        </td>
        <td>
          <CreditAmount
            amount={amount}
            look="plain"
            label={false}
            showPlus={true}
            precision={8}
          />
          <br />
          {fee != 0 &&
            <CreditAmount
              amount={fee}
              look="fee"
              label={false}
              precision={8}
            />}
        </td>
        <td>
          {type}
        </td>
        <td>
          {reward &&
            <Link navigate="/rewards">
              {__("Reward: %s", reward.reward_title)}
            </Link>}
          {name &&
            claimId &&
            <Link
              className="button-text"
              navigate="/show"
              navigateParams={{ uri: lbryuri.build({ name, claimId }) }}
            >
              {name}
            </Link>}
        </td>
        <td>
          <LinkTransaction id={txid} />
        </td>
        <td>
          {isRevokeable &&
            <Link onClick={() => this.abandonClaim(abandonData)}>
              {__("Revoke")}
            </Link>}
        </td>
      </tr>
    );
  }
}

export default TransactionListItem;
