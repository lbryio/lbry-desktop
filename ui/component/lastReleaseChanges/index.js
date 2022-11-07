import { connect } from 'react-redux';
import { selectRemoteVersion } from 'redux/selectors/app';
import LastReleaseChanges from './view';

const select = (state) => ({
  releaseVersion: selectRemoteVersion(state),
});

const perform = {};

export default connect(select, perform)(LastReleaseChanges);
