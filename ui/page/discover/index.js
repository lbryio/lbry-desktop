import { connect } from 'react-redux';
import { doResolveUri, makeSelectClaimForUri, makeSelectIsUriResolving, selectFollowedTags } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import * as CS from 'constants/claim_search';
import DiscoverPage from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const repostedUri = urlParams.has(CS.REPOSTED_URI_KEY)
    ? decodeURIComponent(urlParams.get(CS.REPOSTED_URI_KEY))
    : null;

  return {
    followedTags: selectFollowedTags(state),
    repostedUri: repostedUri,
    isResolvingRepostedUri: makeSelectIsUriResolving(repostedUri)(state),
    repostedClaim: repostedUri ? makeSelectClaimForUri(repostedUri)(state) : null,
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  toggleTagFollowDesktop: tag => dispatch(doToggleTagFollowDesktop(tag)),
});

export default connect(select, perform)(DiscoverPage);
