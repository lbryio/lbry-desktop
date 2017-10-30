import React from "react";
import LinkTransaction from "component/linkTransaction";
import { CreditAmount } from "component/common";
import DateTime from "component/dateTime";
import Link from "component/link";
import lbryuri from "lbryuri";

class TransactionListItem extends React.PureComponent {
  abandonClaim() {
    const {
      claim_id: claimId,
      claim_name: name,
      txid,
      type,
      nout,
    } = this.props.transaction;
    let msg;

    if (type == "tip") {
      msg = "This will reduce the committed credits to the URL";
    } else {
      msg = "This will reclaim you lbc, back to your account";
    }

    const abandonData = {
      name: name,
      claimId: claimId,
      txid: txid,
      nout: nout,
      msg: msg,
    };

    this.props.revokeClaim(abandonData);
  }

  getLink(type) {
    if (type == "tip") {
      return (
        <Link
          onClick={this.abandonClaim.bind(this)}
          icon="icon-unlock-alt"
          title={__("Unlock Tip")}
        />
      );
    } else {
      return (
        <Link
          onClick={this.abandonClaim.bind(this)}
          icon="icon-trash"
          title={__("Delete")}
        />
      );
    }
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
          {type}{" "}
          {isRevokeable && this.getLink(type)}
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
      </tr>
    );
  }
}

export default TransactionListItem;
