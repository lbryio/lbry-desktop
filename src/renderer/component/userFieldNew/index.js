import React from 'react';
import { connect } from 'react-redux';
import { doUserEmailNew, doUserPhoneNew, doUserInviteNew } from 'redux/actions/user';
import {
  selectEmailNewIsPending,
  selectEmailNewErrorMessage,
  selectPhoneNewErrorMessage,
} from 'redux/selectors/user';
import UserFieldNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  emailErrorMessage: selectEmailNewErrorMessage(state),
  phoneErrorMessage: selectPhoneNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserEmailNew(email)),
  addUserPhone: (phone, country_code) => dispatch(doUserPhoneNew(phone, country_code)),
});

export default connect(select, perform)(UserFieldNew);
