import { connect } from 'react-redux';
import { selectClaimsById, doSetFileListSort } from 'lbry-redux';
import FileList from './view';

const select = state => ({
  claimsById: selectClaimsById(state),
});

const perform = dispatch => ({
  setFileListSort: (page, value) => dispatch(doSetFileListSort(page, value)),
});

export default connect(
  select,
  perform
)(FileList);
