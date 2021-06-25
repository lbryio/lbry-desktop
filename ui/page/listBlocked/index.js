import { connect } from 'react-redux';
import { doFetchModBlockedList, doFetchCommentModAmIList } from 'redux/actions/comments';
import { selectMutedChannels } from 'redux/selectors/blocked';
import {
  selectModerationBlockList,
  selectAdminBlockList,
  selectModeratorBlockList,
  selectModeratorBlockListDelegatorsMap,
  selectFetchingModerationBlockList,
  selectModerationDelegatorsById,
} from 'redux/selectors/comments';
import { selectMyChannelClaims } from 'lbry-redux';
import ListBlocked from './view';

const select = (state) => ({
  mutedUris: selectMutedChannels(state),
  personalBlockList: selectModerationBlockList(state),
  adminBlockList: selectAdminBlockList(state),
  moderatorBlockList: selectModeratorBlockList(state),
  moderatorBlockListDelegatorsMap: selectModeratorBlockListDelegatorsMap(state),
  delegatorsById: selectModerationDelegatorsById(state),
  myChannelClaims: selectMyChannelClaims(state),
  fetchingModerationBlockList: selectFetchingModerationBlockList(state),
});

const perform = (dispatch) => ({
  fetchModBlockedList: () => dispatch(doFetchModBlockedList()),
  fetchModAmIList: () => dispatch(doFetchCommentModAmIList()),
});

export default connect(select, perform)(ListBlocked);
