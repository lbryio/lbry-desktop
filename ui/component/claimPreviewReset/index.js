import { connect } from 'react-redux';
import { selectClaimIsMineForUri, selectClaimForUri } from 'redux/selectors/claims';
import { doToast } from 'redux/actions/notifications';
import ClaimPreviewReset from './view';
import { selectActiveLivestreamForChannel } from 'redux/selectors/livestream';
import { getChannelIdFromClaim, getChannelNameFromClaim } from 'util/claim';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);
  const channelId = getChannelIdFromClaim(claim);
  const channelName = getChannelNameFromClaim(claim);
  return {
    activeLivestreamForChannel: selectActiveLivestreamForChannel(state, channelId),
    channelId,
    channelName,
    claimIsMine: props.uri && selectClaimIsMineForUri(state, props.uri),
  };
};

const perform = (dispatch) => ({
  doToast: (props) => dispatch(doToast(props)),
});

export default connect(select, perform)(ClaimPreviewReset);
