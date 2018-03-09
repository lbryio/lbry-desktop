import React from 'react';
import { connect } from 'react-redux';
import FileList from './view';
import { selectClaimsById } from 'redux/selectors/claims';

const select = state => ({
  claimsById: selectClaimsById(state),
});

const perform = dispatch => ({});

export default connect(select, perform)(FileList);
