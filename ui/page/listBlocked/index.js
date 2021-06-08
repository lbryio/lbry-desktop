import { connect } from 'react-redux';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectModerationBlockList, selectFetchingModerationBlockList } from 'redux/selectors/comments';
import ListBlocked from './view';

const select = (state) => ({
  mutedUris: selectMutedChannels(state),
  blockedUris: selectModerationBlockList(state),
  fetchingModerationBlockList: selectFetchingModerationBlockList(state),
});

export default connect(select)(ListBlocked);
