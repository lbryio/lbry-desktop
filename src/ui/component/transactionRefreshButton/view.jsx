// @flow
import React, { PureComponent } from 'react';
import Button from 'component/button';
import { LATEST_PAGE_SIZE } from 'constants/claim';

type Props = {
  fetchTransactions: () => void,
  fetchingTransactions: boolean,
  slim: boolean,
};

type State = {
  label: string,
  disabled: boolean,
};

class TransactionRefreshButton extends PureComponent<Props, State> {
  constructor() {
    super();

    this.state = { label: __('Refresh'), disabled: false };

    (this: any).handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { fetchTransactions, slim } = this.props;

    // The fetchTransactions call will be super fast most of the time.
    // Instead of showing a loading spinner for 100ms, change the label and show as "Refreshed!"
    if (slim) {
      fetchTransactions(1, LATEST_PAGE_SIZE);
    } else {
      fetchTransactions(1, 999999);
    }

    this.setState({ label: __('Refreshed!'), disabled: true });

    setTimeout(() => {
      this.setState({ label: __('Refresh'), disabled: false });
    }, 2000);
  }

  render() {
    const { fetchingTransactions } = this.props;
    const { label, disabled } = this.state;
    return (
      <Button button="link" label={label} onClick={this.handleClick} disabled={disabled || fetchingTransactions} />
    );
  }
}

export default TransactionRefreshButton;
