import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import {
  selectIsFetchingTxos,
  selectIsFetchingTransactions,
  selectFetchingTxosError,
  selectTransactionsFile,
  selectTxoPage,
  selectTxoPageNumber,
  selectTxoItemCount,
  doFetchTxoPage,
  doFetchTransactions,
  doUpdateTxoPageParams,
} from 'lbry-redux';
import { withRouter } from 'react-router';
import StripeAccountConnection from './view';
import { createSelector } from 'reselect';
import { selectUser } from 'redux/selectors/user';


// function that receives state parameter and returns object of functions that accept  state
const select = (state) => ({
  txoFetchError: selectFetchingTxosError(state),
  txoPage: selectTxoPage(state),
  txoPageNumber: selectTxoPageNumber(state),
  txoItemCount: selectTxoItemCount(state),
  loading: selectIsFetchingTxos(state),
  isFetchingTransactions: selectIsFetchingTransactions(state),
  transactionsFile: selectTransactionsFile(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchTxoPage: () => dispatch(doFetchTxoPage()),
  fetchTransactions: () => dispatch(doFetchTransactions()),
  updateTxoPageParams: (params) => dispatch(doUpdateTxoPageParams(params)),
});

var thing = connect(select, perform)(StripeAccountConnection)

export default withRouter(thing);
