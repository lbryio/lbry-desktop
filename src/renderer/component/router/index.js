import { connect } from 'react-redux';
import { selectCurrentPage, selectCurrentParams } from 'lbry-redux';
import Router from './view';

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
});

export default connect(select, null)(Router);
