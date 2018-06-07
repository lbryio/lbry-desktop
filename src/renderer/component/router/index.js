import { connect } from 'react-redux';
import { selectCurrentPage, selectCurrentParams, doNotify } from 'lbry-redux';
import Router from './view';

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
});

export default connect(select, { doNotify })(Router);
