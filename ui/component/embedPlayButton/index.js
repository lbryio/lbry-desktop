import { connect } from 'react-redux';
import { makeSelectThumbnailForUri, doResolveUri, makeSelectClaimForUri, SETTINGS } from 'lbry-redux';
import { doFetchCostInfoForUri, makeSelectCostInfoForUri } from 'lbryinc';
import { doSetFloatingUri, doPlayUri } from 'redux/actions/content';
import { doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
});

export default connect(select, {
  doResolveUri,
  doFetchCostInfoForUri,
  doSetFloatingUri,
  doPlayUri,
  doAnaltyicsPurchaseEvent,
})(ChannelThumbnail);
