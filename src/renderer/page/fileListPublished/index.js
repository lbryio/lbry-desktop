import { connect } from 'react-redux';
import { selectPendingPublishes, selectClaimsWithPendingPublishes } from 'redux/selectors/publish';
import { selectIsFetchingClaimListMine } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doCheckPendingPublishes } from 'redux/actions/publish';
import FileListPublished from './view';

const select = state => ({
  claims: selectClaimsWithPendingPublishes(state),
  fetching: selectIsFetchingClaimListMine(state),
  pendingPublishes: selectPendingPublishes(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  checkIfPublishesConfirmed: publishes => dispatch(doCheckPendingPublishes(publishes)),
});

export default connect(
  select,
  perform
)(FileListPublished);
