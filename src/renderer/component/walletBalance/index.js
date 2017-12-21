import React from 'react';
import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import WalletBalance from './view';

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, null)(WalletBalance);
