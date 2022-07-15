import { connect } from 'react-redux';
import { doPrepareEdit } from 'redux/actions/publish';
import { selectClaimForUri, selectChannelNameForClaimUri, selectClaimIsMineForUri } from 'redux/selectors/claims';
import ClaimPublishButton from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);

  return {
    claim,
    channelName: selectChannelNameForClaimUri(state, uri),
    claimIsMine: selectClaimIsMineForUri(state, uri),
  };
};

const perform = {
  doPrepareEdit,
};

export default connect(select, perform)(ClaimPublishButton);
