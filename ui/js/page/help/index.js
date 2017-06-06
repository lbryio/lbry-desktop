import React from 'react';
import { doNavigate } from 'actions/app';
import { connect } from 'react-redux';
import HelpPage from './view';

const perform = dispatch => ({
	navigate: (path, params) => dispatch(doNavigate(path, params))
});

export default connect(null, perform)(HelpPage);
