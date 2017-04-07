import React from 'react';
import { connect } from 'react-redux';
import Router from './view.jsx';
import {
  selectCurrentPage
} from 'selectors/app.js';

const select = (state) => ({
  currentPage: selectCurrentPage(state)
})

const perform = {
}

export default connect(select, null)(Router);
