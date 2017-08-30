import React from "react";
import LinkTransaction from "component/linkTransaction";
import { CreditAmount } from "component/common";

const TransactionList = props => {
  const { emptyMessage, transactions } = props;

  if (!transactions || !transactions.length) {
    return (
      <div className="empty">
        {emptyMessage || __("No transactions to list.")}
      </div>
    );
  }

  return (
    <table className="table-standard table-stretch">
      <thead>
        <tr>
          <th>{__("Date")}</th>
          <th>{__("Amount")}</th>
          <th>{__("Transaction")}</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(item => {
          return (
            <tr key={item.id}>
              <td>
                {item.date
                  ? item.date.toLocaleDateString() +
                      " " +
                      item.date.toLocaleTimeString()
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
                <LinkTransaction id={item.id} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionList;
