import { connect } from 'react-redux';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { doPlayUri } from 'redux/actions/content';
import { withRouter } from 'react-router';
import { makeSelectClaimWasPurchased } from 'lbry-redux';
import FileRenderDownload from './view';

const select = (state, props) => ({
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
  claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
});

export default withRouter(
  connect(select, {
    doPlayUri,
  })(FileRenderDownload)
);
