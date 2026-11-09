//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { withRouter } from 'react-router';
import FileRenderDownload from './view';

const select = (state: unknown, props: unknown) => ({
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
});

export default withRouter(connect(select)(FileRenderDownload));
