import React from "react";
import LinkTransaction from "component/linkTransaction";
import { CreditAmount } from "component/common";

class TransactionTableBody extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getClaimLink(claim_name, claim_id) {
    let uri = `lbry://${claim_name}#${claim_id}`;

    return (
      <a className="button-text" onClick={() => this.props.navigate(uri)}>
        {claim_name}
      </a>
    );
  }

  filterList(transaction) {
    if (this.props.filter == "claim") {
      return transaction.claim_info.length > 0;
    } else if (this.props.filter == "support") {
      return transaction.support_info.length > 0;
    } else if (this.props.filter == "update") {
      return transaction.update_info.length > 0;
    } else {
      return transaction;
    }
  }

  renderBody(transaction) {
    const txid = transaction.id;
    const date = transaction.date;
    const fee = transaction.fee;
    const filter = this.props.filter;
    const options = {
      weekday: "short",
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    if (filter == "tipSupport")
      transaction["tipSupport_info"] = transaction["support_info"].filter(
        tx => tx.is_tip
      );

    return filter != "unfiltered"
      ? transaction[`${filter}_info`].map(item => {
          return (
            <tr key={`${txid}:${item.nout}`}>
              <td>
                {date
                  ? date.toLocaleDateString("en-US", options)
                  : <span className="empty">
                      {__("(Transaction pending)")}
                    </span>}
              </td>
              <td>
                <CreditAmount
                  amount={item.amount}
                  look="plain"
                  label={false}
                  showPlus={true}
                  precision={8}
                />
                <br />
                <CreditAmount
                  amount={fee}
                  look="plain"
                  fee={true}
                  label={false}
                  precision={8}
                />
              </td>
              <td>
                {this.getClaimLink(item.claim_name, item.claim_id)}
              </td>
              <td>
                <LinkTransaction id={txid} />
              </td>
            </tr>
          );
        })
      : <tr key={txid}>
          <td>
            {date
              ? date.toLocaleDateString("en-US", options)
              : <span className="empty">
                  {__("(Transaction pending)")}
                </span>}
          </td>
          <td>
            <CreditAmount
              amount={transaction.amount}
              look="plain"
              label={false}
              showPlus={true}
              precision={8}
            />
            <br />
            <CreditAmount
              amount={fee}
              look="plain"
              fee={true}
              label={false}
              precision={8}
            />
          </td>
          <td>
            <LinkTransaction id={txid} />
          </td>
        </tr>;
  }

  removeFeeTx(transaction) {
    if (this.props.filter == "unfiltered")
      return Math.abs(transaction.amount) != Math.abs(transaction.fee);
    else return true;
  }

  render() {
    const { transactions, filter } = this.props;

    return (
      <tbody>
        {transactions
          .filter(this.filterList, this)
          .filter(this.removeFeeTx, this)
          .map(this.renderBody, this)}
      </tbody>
    );
  }
}

export default TransactionTableBody;
