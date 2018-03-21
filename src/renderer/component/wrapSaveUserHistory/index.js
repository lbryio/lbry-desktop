import React from 'react';
import { connect } from 'react-redux';
import { doUserHistorySave } from 'redux/actions/user';
import WrapSaveUserHistory from './view';

const perform = dispatch => ({
  saveUserHistory: uri => dispatch(doUserHistorySave(uri))
});

export default connect(null, perform)(WrapSaveUserHistory);
