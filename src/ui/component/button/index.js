import Button from './view';
import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'lbryinc';

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  emailVerified: selectUserVerifiedEmail(state),
});

const ConnectedButton = connect(mapStateToProps)(Button);

export default forwardRef((props, ref) => <ConnectedButton {...props} myref={ref} />);
