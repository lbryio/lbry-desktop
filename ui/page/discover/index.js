import * as CS from 'constants/claim_search';
import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { selectClaimForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
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
    repostedClaim: repostedUri ? selectClaimForUri(state, repostedUri) : null,
    tileLayout: makeSelectClientSetting(SETTINGS.TILE_LAYOUT)(state),
  };
};

export default connect(select, {
  doToggleTagFollowDesktop,
  doResolveUri,
})(Tags);
