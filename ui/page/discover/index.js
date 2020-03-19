import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectFollowedTags } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import * as CS from 'constants/claim_search';
import Tags from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const repostedUri = decodeURIComponent(urlParams.get(CS.REPOSTED_URI_KEY));

  return {
    followedTags: selectFollowedTags(state),
    repostedUri: repostedUri,
    repostedClaim: repostedUri ? makeSelectClaimForUri(repostedUri)(state) : null,
  };
};

export default connect(select, {
  doToggleTagFollowDesktop,
})(Tags);
