import React from "react";
import { Address, BusyMessage, CreditAmount } from "component/common";

class TransactionList extends React.PureComponent {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, transactionItems, navigate } = this.props;

    function findTypeOfTx(type, is_tip) {
      if (is_tip && type === "Support") return "Tip";
      else return type;
    }

    function getClaimLink(claim_name, claim_id) {
      if (claim_id !== "" && claim_name !== "") {
        let uri = `lbry://${claim_name}#${claim_id}`;

        return (
          <td>
            <a
              className="button-text"
              onClick={() => navigate("/show", { uri })}
            >
              {claim_name}
            </a>
          </td>
        );
      }

      return <td>{__("N/A")}</td>;
    }

    const rows = [];
    if (transactionItems.length > 0) {
      transactionItems.forEach(function(item) {
        rows.push(
          <tr key={item.id}>
            <td>{findTypeOfTx(item.type, item.is_tip)}</td>
            <td>{(item.amount > 0 ? "+" : "") + item.amount}</td>
            <td>{item.fee}</td>
            <td>
              {item.date
                ? item.date.toLocaleDateString()
                : <span className="empty">{__("(Transaction pending)")}</span>}
            </td>
            <td>
              {item.date
                ? item.date.toLocaleTimeString()
                : <span className="empty">{__("(Transaction pending)")}</span>}
            </td>
            {getClaimLink(item.claim_name, item.claim_id)}
            <td>
              <a
                className="button-text"
                href={"https://explorer.lbry.io/#!/transaction/" + item.id}
              >
                {item.id.substr(0, 7)}
              </a>
            </td>
          </tr>
        );
      });
    }

    return (
      <section className="card">
        <div className="card__title-primary">
          <h3>{__("Transaction History")}</h3>
        </div>
        <div className="card__content">
          {fetchingTransactions &&
            <BusyMessage message={__("Loading transactions")} />}
          {!fetchingTransactions && rows.length === 0
            ? <div className="empty">{__("You have no transactions.")}</div>
            : ""}
          {rows.length > 0
            ? <table className="table-standard table-stretch">
                <thead>
                  <tr>
                    <th>{__("Type")}</th>
                    <th>{__("Amount")}</th>
                    <th>{__("Fee")}</th>
                    <th>{__("Date")}</th>
                    <th>{__("Time")}</th>
                    <th>{__("Claim")}</th>
                    <th>{__("Transaction")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            : ""}
        </div>
      </section>
    );
  }
}

export default TransactionList;
