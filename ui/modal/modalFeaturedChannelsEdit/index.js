import ModalFeaturedChannelsEdit from './view';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';

const perform = {
  doHideModal,
};

export default connect(null, perform)(ModalFeaturedChannelsEdit);
