import React from 'react';
import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doCloseModal } from 'redux/actions/app';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectPhoneToVerify, selectUser } from 'redux/selectors/user';
import ModalPhoneCollection from './view';
import { doNavigate } from 'redux/actions/navigation';

const select = state => ({
  phone: selectPhoneToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doCloseModal());
    dispatch(doNavigate('/rewards'));
  },
});

export default connect(select, perform)(ModalPhoneCollection);
