import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectThumbnailForUri, doResolveUri, makeSelectClaimForUri } from 'lbry-redux';
import { doFetchCostInfoForUri } from 'lbryinc';
import { doSetFloatingUri, doPlayUri } from 'redux/actions/content';
import { doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  floatingPlayerEnabled: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
});

export default connect(select, {
  doResolveUri,
  doFetchCostInfoForUri,
  doSetFloatingUri,
  doPlayUri,
  doAnaltyicsPurchaseEvent,
})(ChannelThumbnail);
