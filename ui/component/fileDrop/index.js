import { connect } from 'react-redux';

import { doToast, doClearPublish, doUpdatePublishForm, makeSelectPublishFormValue } from 'lbry-redux';

import { selectModal } from 'redux/selectors/app';
import { doOpenModal } from 'redux/actions/app';

import FileDrop from './view';

const select = state => ({
  modal: selectModal(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  showToast: message => dispatch(doToast({ message, isError: true })),
  clearPublish: () => dispatch(doClearPublish()),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(FileDrop);
