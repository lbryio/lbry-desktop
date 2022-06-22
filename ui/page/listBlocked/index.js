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
  selectAdminTimeoutMap,
  selectModeratorTimeoutMap,
  selectPersonalTimeoutMap,
} from 'redux/selectors/comments';
import { selectMyChannelClaimIds } from 'redux/selectors/claims';
import ListBlocked from './view';

const select = (state) => ({
  mutedUris: selectMutedChannels(state),
  personalBlockList: selectModerationBlockList(state),
  adminBlockList: selectAdminBlockList(state),
  moderatorBlockList: selectModeratorBlockList(state),
  personalTimeoutMap: selectPersonalTimeoutMap(state),
  adminTimeoutMap: selectAdminTimeoutMap(state),
  moderatorTimeoutMap: selectModeratorTimeoutMap(state),
  moderatorBlockListDelegatorsMap: selectModeratorBlockListDelegatorsMap(state),
  delegatorsById: selectModerationDelegatorsById(state),
  myChannelClaimIds: selectMyChannelClaimIds(state),
  fetchingModerationBlockList: selectFetchingModerationBlockList(state),
});

const perform = (dispatch) => ({
  fetchModBlockedList: () => dispatch(doFetchModBlockedList()),
  fetchModAmIList: () => dispatch(doFetchCommentModAmIList()),
});

export default connect(select, perform)(ListBlocked);
