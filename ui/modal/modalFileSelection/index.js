import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doUpdatePublishForm } from 'lbry-redux';

import ModaFileSelection from './view';

const perform = dispatch => ({
  hideModal: props => dispatch(doHideModal(props)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(null, perform)(ModaFileSelection);
