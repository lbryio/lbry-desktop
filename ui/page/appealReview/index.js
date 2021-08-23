import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';

import AppealReview from './view';

const select = (state) => ({});

const perform = (dispatch) => ({
  doOpenModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(AppealReview);
