import React from "react";
import TransactionTableHeader from "component/headerTransactionList";
import TransactionTableBody from "component/bodyTransactionList";
import FormField from "component/formField";

class TransactionList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filter: "unfiltered",
    };
  }

  handleFilterChanged(event) {
    this.setState({
      filter: event.target.value,
    });
  }

  render() {
    const { emptyMessage, transactions } = this.props;
    const { filter } = this.state;

    if (!transactions || !transactions.length) {
      return (
        <div className="empty">
          {emptyMessage || __("No transactions to list.")}
        </div>
      );
    }

    return (
      <div>
        <span className="sort-section">
          {__("Filter")} {" "}
          <FormField
            type="select"
            onChange={this.handleFilterChanged.bind(this)}
          >
            <option value="unfiltered">{__("Unfiltered")}</option>
            <option value="claim">{__("Claim")}</option>
            <option value="support">{__("Support")}</option>
            <option value="update">{__("Update")}</option>
          </FormField>
        </span>
        <table className="table-standard table-stretch">
          <TransactionTableHeader filter={filter} />
          <TransactionTableBody transactions={transactions} filter={filter} />
        </table>
      </div>
    );
  }
}

export default TransactionList;
