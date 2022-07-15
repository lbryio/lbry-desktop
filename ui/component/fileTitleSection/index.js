import { connect } from 'react-redux';
import { doFetchSubCount, selectSubCountForUri } from 'lbryinc';
import { selectClaimForUri } from 'redux/selectors/claims';
import FileTitleSection from './view';
import { getClaimTitle } from 'util/claim';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);

  const { signing_channel: channel } = claim || {};
  const channelUri = channel && channel.canonical_url;
  const channelClaimId = channel && channel.claim_id;
  const title = getClaimTitle(claim);

  return {
    subCount: channelUri && selectSubCountForUri(state, channelUri),
    channelClaimId,
    title,
  };
};

const perform = {
  doFetchSubCount,
};

export default connect(select, perform)(FileTitleSection);
