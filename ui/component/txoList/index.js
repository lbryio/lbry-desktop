import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import {
  selectIsFetchingTxos,
  selectFetchingTxosError,
  selectTxoPage,
  selectTxoPageNumber,
  selectTxoItemCount,
  doFetchTxoPage,
  doUpdateTxoPageParams,
} from 'lbry-redux';
import { withRouter } from 'react-router';
import TxoList from './view';

const select = state => ({
  txoFetchError: selectFetchingTxosError(state),
  txoPage: selectTxoPage(state),
  txoPageNumber: selectTxoPageNumber(state),
  txoItemCount: selectTxoItemCount(state),
  loading: selectIsFetchingTxos(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  fetchTxoPage: () => dispatch(doFetchTxoPage()),
  updateTxoPageParams: params => dispatch(doUpdateTxoPageParams(params)),
});

export default withRouter(connect(select, perform)(TxoList));
