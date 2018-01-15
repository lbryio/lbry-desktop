import React from 'react';
import { connect } from 'react-redux';
import { doUserEmailNew, doUserPhoneNew, doUserInviteNew } from 'redux/actions/user';
import { selectEmailNewIsPending, selectEmailNewErrorMessage } from 'redux/selectors/user';
import UserFieldNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserEmailNew(email)),
  addUserPhone: phone => dispatch(doUserPhoneNew(phone)),
});

export default connect(select, perform)(UserFieldNew);
