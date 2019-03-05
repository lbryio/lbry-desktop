import { connect } from 'react-redux';
import { selectCurrentPage, selectCurrentParams, doToast } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import Router from './view';

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
});

export default connect(
  select,
  { doOpenModal, doToast }
)(Router);
