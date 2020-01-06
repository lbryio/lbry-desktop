import { connect } from 'react-redux';
import { makeSelectViewCountForUri } from 'lbryinc';
import FileViewCount from './view';

const select = (state, props) => ({
  viewCount: makeSelectViewCountForUri(props.uri)(state),
});

export default connect(select)(FileViewCount);
