import { connect } from 'react-redux';
import { doNavigate, selectCurrentPage, selectHeaderLinks } from 'lbry-redux';
import SubHeader from './view';

const select = (state, props) => ({
  currentPage: selectCurrentPage(state),
  subLinks: selectHeaderLinks(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(SubHeader);
