import React from 'react';
import { connect } from 'react-redux';
import { doQuit } from 'redux/actions/app';
import ModalUpdateCloseAlert from './view';

const select = state => ({});

const perform = dispatch => ({
  quit: () => dispatch(doSkipUpgrade()),
});

export default connect(select, perform)(ModalUpdateCloseAlert);
