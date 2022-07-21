import { connect } from 'react-redux';
import { selectThumbnailForUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import * as SETTINGS from 'constants/settings';
import { doFetchCostInfoForUri, selectCostInfoForUri } from 'lbryinc';
import { doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import { doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';

import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: selectThumbnailForUri(state, props.uri),
  claim: makeSelectClaimForUri(props.uri)(state),
  floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  costInfo: selectCostInfoForUri(state, props.uri),
  renderMode: makeSelectFileRenderModeForUri(props.uri)(state),
});

export default connect(select, {
  doResolveUri,
  doFetchCostInfoForUri,
  doPlayUri,
  doSetPlayingUri,
  doAnaltyicsPurchaseEvent,
})(ChannelThumbnail);
