import { connect } from 'react-redux';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { withRouter } from 'react-router';
import FileRenderDownload from './view';

const select = (state, props) => ({
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
});

export default withRouter(connect(select)(FileRenderDownload));
