import { connect } from 'react-redux';
import { selectRemoteVersion, selectReleaseNotes } from 'redux/selectors/app';
import LastReleaseChanges from './view';

const select = (state) => ({
  releaseVersion: selectRemoteVersion(state),
  releaseNotes: selectReleaseNotes(state),
});

const perform = () => ({});

export default connect(select, perform)(LastReleaseChanges);
