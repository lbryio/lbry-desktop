import { connect } from 'react-redux';
import { selectRecentHistory } from 'redux/selectors/content';
import RecentUserHistory from './view';

const select = (state, props) => ({
  history: selectRecentHistory(state),
});

export default connect(
  select,
  null
)(RecentUserHistory);
