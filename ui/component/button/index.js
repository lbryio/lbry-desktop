import Button from './view';
import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import { selectUser, selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasChannels } from 'redux/selectors/claims';

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  emailVerified: selectUserVerifiedEmail(state),
  user: selectUser(state),
  hasChannels: selectHasChannels(state),
});

const ConnectedButton = connect(mapStateToProps)(Button);

export default forwardRef((props, ref) => <ConnectedButton {...props} myref={ref} />);
