import React from 'react';
import { connect } from 'react-redux';
import { doUserFieldNew, doUserInviteNew } from 'redux/actions/user';
import { selectEmailNewIsPending, selectEmailNewErrorMessage } from 'redux/selectors/user';
import UserFieldNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserFieldNew(email)),
});

export default connect(select, perform)(UserFieldNew);
