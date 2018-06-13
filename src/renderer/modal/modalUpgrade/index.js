import React from 'react';
import { connect } from 'react-redux';
import { doDownloadUpgrade, doSkipUpgrade, doHideNotification } from 'redux/actions/app';
import ModalUpgrade from './view';

const select = state => ({});

const perform = dispatch => ({
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
  skipUpgrade: () => {
    dispatch(doHideNotification());
    dispatch(doSkipUpgrade());
  },
});

export default connect(
  select,
  perform
)(ModalUpgrade);
