import React from "react";
import LinkTransaction from "component/linkTransaction";
import { CreditAmount } from "component/common";

class TransactionTableBody extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  filterList(transaction) {
    if (this.filter == "claim") {
      return transaction.claim_info.length > 0;
    } else if (this.filter == "support") {
      return transaction.support_info.length > 0;
    } else if (this.filter == "update") {
      return transaction.update_info.length > 0;
    } else {
      return transaction;
    }
  }

  renderBody(transaction, index) {
    const txid = transaction.id;
    const date = transaction.date;
    const fee = transaction.fee;
    const filter = this.filter;

    return filter != "unfiltered"
      ? transaction[`${filter}_info`].map(item => {
          return (
            <tr key={`${txid}:${item.nout}`}>
              <td>
                {date
                  ? date.toLocaleDateString() + " " + date.toLocaleTimeString()
                  : <span className="empty">
                      {__("(Transaction pending)")}
                    </span>}
              </td>
              <td>
                <CreditAmount
                  amount={item.amount}
                  look="plain"
                  showPlus={true}
                  precision={8}
                />{" "}
              </td>
              <td>
                <CreditAmount amount={fee} look="plain" precision={8} />{" "}
              </td>
              <td>
                {item.claim_name}
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
              ? date.toLocaleDateString() + " " + date.toLocaleTimeString()
              : <span className="empty">
                  {__("(Transaction pending)")}
                </span>}
          </td>
          <td>
            <CreditAmount
              amount={transaction.amount}
              look="plain"
              showPlus={true}
              precision={8}
            />{" "}
          </td>
          <td>
            <CreditAmount amount={fee} look="plain" precision={8} />{" "}
          </td>
          <td>
            <LinkTransaction id={txid} />
          </td>
        </tr>;
  }

  render() {
    const { transactions, filter } = this.props;

    return (
      <tbody>
        {transactions
          .filter(this.filterList, this.props)
          .map(this.renderBody, this.props)}
      </tbody>
    );
  }
}

export default TransactionTableBody;
