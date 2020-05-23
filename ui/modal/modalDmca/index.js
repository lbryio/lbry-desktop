import { connect } from 'react-redux';
import { doHideModal, doOpenModal } from 'redux/actions/app';
import { doCheckAddressIsMine, doGetNewAddress, selectReceiveAddress, selectGettingNewAddress } from 'lbry-redux';
import ModalDmca from './view';

const select = state => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doHideModal());
  },
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  checkAddressIsMine: address => dispatch(doCheckAddressIsMine(address)),
  getNewAddress: () => dispatch(doGetNewAddress()),
});

export default connect(select, perform)(ModalDmca);
