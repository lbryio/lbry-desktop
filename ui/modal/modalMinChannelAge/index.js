import { connect } from 'react-redux';
import ModalMinChannelAge from './view';
import { doHideModal } from 'redux/actions/app';

const perform = {
  doHideModal,
};

export default connect(null, perform)(ModalMinChannelAge);
