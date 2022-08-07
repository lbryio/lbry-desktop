import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectIsFetchingTxos } from 'redux/selectors/wallet';
import TransactionListTable from './view';

const select = (state) => ({
  loading: selectIsFetchingTxos(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(TransactionListTable);
