import React from 'react';
import { connect } from 'react-redux';
import { doCloseModal, doAutoUpdateDeclined } from 'redux/actions/app';
import ModalAutoUpdateDownloaded from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  declineAutoUpdate: () => dispatch(doAutoUpdateDeclined()),
});

export default connect(null, perform)(ModalAutoUpdateDownloaded);
