import React from 'react';
import { connect } from 'react-redux';
import { doUserPhoneNew } from 'redux/actions/user';
import { selectPhoneNewErrorMessage } from 'redux/selectors/user';
import UserPhoneNew from './view';

const select = state => ({
  phoneErrorMessage: selectPhoneNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserPhone: (phone, country_code) => dispatch(doUserPhoneNew(phone, country_code)),
});

export default connect(select, perform)(UserPhoneNew);
