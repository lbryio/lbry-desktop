import React from 'react';
import { connect } from 'react-redux';
import { doCloseModal } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import ModalFirstSubscription from './view';

const perform = dispatch => () => ({
  closeModal: () => dispatch(doCloseModal()),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(null, perform)(ModalFirstSubscription);
