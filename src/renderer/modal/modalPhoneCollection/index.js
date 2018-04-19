import React from 'react';
import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectPhoneToVerify, selectUser } from 'redux/selectors/user';
import { doNavigate } from 'redux/actions/navigation';
import ModalPhoneCollection from './view';

const select = state => ({
  phone: selectPhoneToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doHideNotification());
    dispatch(doNavigate('/rewards'));
  },
});

export default connect(select, perform)(ModalPhoneCollection);
