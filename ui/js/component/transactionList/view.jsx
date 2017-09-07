import React from "react";
import TransactionTableHeader from "./internal/TransactionListHeader";
import TransactionTableBody from "./internal/TransactionListBody";
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

  handleClaimNameClicked(uri) {
    this.props.navigate("/show", { uri });
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
            <option value="unfiltered">{__("All")}</option>
            <option value="claim">{__("Publishes")}</option>
            <option value="support">{__("Supports")}</option>
            <option value="tipSupport">{__("Tips")}</option>
            <option value="update">{__("Updates")}</option>
          </FormField>
        </span>
        <table className="table-standard table-stretch">
          <TransactionTableHeader filter={filter} />
          <TransactionTableBody
            transactions={transactions}
            filter={filter}
            navigate={this.handleClaimNameClicked.bind(this)}
          />
        </table>
      </div>
    );
  }
}

export default TransactionList;
