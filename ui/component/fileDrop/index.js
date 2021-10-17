import { connect } from 'react-redux';

import { doUpdatePublishForm } from 'redux/actions/publish';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';

import { selectModal } from 'redux/selectors/app';
import { doOpenModal } from 'redux/actions/app';

import FileDrop from './view';

const select = (state) => ({
  modal: selectModal(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(FileDrop);
