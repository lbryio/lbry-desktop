import { connect } from 'react-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectClaimIsMineForUri } from 'redux/selectors/claims';
import { doToast } from 'redux/actions/notifications';
import ClaimPreviewReset from './view';

const select = (state, props) => {
  const { claim_id: channelId, name: channelName } = selectActiveChannelClaim(state) || {};
  return {
    channelName,
    channelId,
    claimIsMine: props.uri && selectClaimIsMineForUri(state, props.uri),
  };
};

const perform = (dispatch) => ({
  doToast: (props) => dispatch(doToast(props)),
});

export default connect(select, perform)(ClaimPreviewReset);
