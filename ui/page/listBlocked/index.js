import { connect } from 'react-redux';
import { doFetchModBlockedList } from 'redux/actions/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectModerationBlockList, selectFetchingModerationBlockList } from 'redux/selectors/comments';
import ListBlocked from './view';

const select = (state) => ({
  mutedUris: selectMutedChannels(state),
  blockedUris: selectModerationBlockList(state),
  fetchingModerationBlockList: selectFetchingModerationBlockList(state),
});

const perform = (dispatch) => ({
  fetchModBlockedList: () => dispatch(doFetchModBlockedList()),
});

export default connect(select, perform)(ListBlocked);
