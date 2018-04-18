import { connect } from 'react-redux';
import { selectMyClaimsWithoutChannels } from 'lbry-redux';
import { selectPendingPublishesLessEdits } from 'redux/selectors/publish';
import { doNavigate } from 'redux/actions/navigation';
import { doCheckPendingPublishes } from 'redux/actions/publish';
import FileListPublished from './view';

const select = state => ({
  claims: selectMyClaimsWithoutChannels(state),
  pendingPublishes: selectPendingPublishesLessEdits(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  checkIfPublishesConfirmed: publishes => dispatch(doCheckPendingPublishes(publishes)),
});

export default connect(select, perform)(FileListPublished);
