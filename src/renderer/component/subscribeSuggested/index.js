import { connect } from 'react-redux';
import { selectSuggestedChannels } from 'redux/selectors/subscriptions';
import SuggestedSubscriptions from './view';

const select = state => ({
  suggested: selectSuggestedChannels(state),
});

export default connect(
  select,
  null
)(SuggestedSubscriptions);
