import { connect } from 'react-redux';
import { selectMyClaimsWithoutChannels } from 'redux/selectors/claims';
import { selectPendingPublishes } from 'redux/selectors/publish';
import { doNavigate } from 'redux/actions/navigation';
import { doCheckPendingPublishes } from 'redux/actions/publish';
import FileListPublished from './view';

const select = state => ({
  claims: selectMyClaimsWithoutChannels(state),
  pendingPublishes: selectPendingPublishes(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  checkIfPublishesConfirmed: publishes => dispatch(doCheckPendingPublishes(publishes)),
});

export default connect(select, perform)(FileListPublished);
