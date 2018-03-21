import React from 'react';
import { connect } from 'react-redux';
import { doSendSupport } from 'redux/actions/wallet';
import WalletSendTip from './view';
import { makeSelectTitleForUri } from 'redux/selectors/claims';
import { selectIsSendingSupport } from 'redux/selectors/wallet';

const select = (state, props) => ({
  isPending: selectIsSendingSupport(state),
  title: makeSelectTitleForUri(props.uri)(state),
});

const perform = dispatch => ({
  sendSupport: (amount, claim_id, uri) => dispatch(doSendSupport(amount, claim_id, uri)),
});

export default connect(select, perform)(WalletSendTip);
