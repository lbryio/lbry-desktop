import { connect } from 'react-redux';
import { selectFileInfosDownloaded, selectMyClaimsWithoutChannels } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import FileListDownloaded from './view';

const select = state => ({
  fileInfos: selectFileInfosDownloaded(state),
  claims: selectMyClaimsWithoutChannels(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(FileListDownloaded);
