import { connect } from 'react-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { doToast } from 'redux/actions/notifications';
import ClaimPreviewReset from './view';

const select = (state) => {
  const { claim_id: channelId, name: channelName } = selectActiveChannelClaim(state) || {};
  return {
    channelName,
    channelId,
  };
};

const perform = (dispatch) => ({
  doToast: (props) => dispatch(doToast(props)),
});

export default connect(select, perform)(ClaimPreviewReset);
