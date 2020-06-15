import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectFollowedTags, doResolveUri } from 'lbry-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import * as CS from 'constants/claim_search';
import Tags from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const repostedUriInUrl = urlParams.get(CS.REPOSTED_URI_KEY);
  const repostedUri = repostedUriInUrl ? decodeURIComponent(repostedUriInUrl) : undefined;

  return {
    followedTags: selectFollowedTags(state),
    repostedUri: repostedUri,
    repostedClaim: repostedUri ? makeSelectClaimForUri(repostedUri)(state) : null,
    isAuthenticated: selectUserVerifiedEmail(state),
  };
};

export default connect(select, {
  doToggleTagFollowDesktop,
  doResolveUri,
})(Tags);
