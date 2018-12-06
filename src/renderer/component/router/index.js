import { connect } from 'react-redux';
import { selectCurrentPage, selectCurrentParams } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import Router from './view';

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
});

export default connect(
  select,
  { doOpenModal }
)(Router);
