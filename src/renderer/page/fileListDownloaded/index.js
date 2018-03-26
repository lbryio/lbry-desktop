import { connect } from 'react-redux';
import { selectFileInfosDownloaded } from 'redux/selectors/file_info';
import { selectMyClaimsWithoutChannels } from 'redux/selectors/claims';
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
