import Button from './view';
import React, { forwardRef } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
});

const ConnectedButton = connect(mapStateToProps)(Button);

export default forwardRef((props, ref) => <ConnectedButton {...props} myref={ref} />);
