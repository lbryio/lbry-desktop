import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectTransactionItems } from 'redux/selectors/wallet';
import ModalSupportsLiquidate from './view';

const select = (state) => ({
  transactionItems: selectTransactionItems(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalSupportsLiquidate);
