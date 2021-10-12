import * as CS from 'constants/claim_search';
import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { doFetchActiveLivestreams } from 'redux/actions/livestream';
import { selectActiveLivestreams } from 'redux/selectors/livestream';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectFollowedTags } from 'redux/selectors/tags';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { makeSelectClientSetting } from 'redux/selectors/settings';
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
    tileLayout: makeSelectClientSetting(SETTINGS.TILE_LAYOUT)(state),
    activeLivestreams: selectActiveLivestreams(state),
  };
};

export default connect(select, {
  doToggleTagFollowDesktop,
  doResolveUri,
  doFetchActiveLivestreams,
})(Tags);
