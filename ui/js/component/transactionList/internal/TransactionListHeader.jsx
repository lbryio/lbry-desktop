import React from "react";

class TransactionTableHeader extends React.PureComponent {
  render() {
    const { filter } = this.props;
    return (
      <thead>
        <tr>
          <th>{__("Date")}</th>
          <th>{__("Amount(Fee)")}</th>
          {filter != "unfiltered" && <th> {__("Claim Name")} </th>}
          <th>{__("Transaction")}</th>
        </tr>
      </thead>
    );
  }
}

export default TransactionTableHeader;
