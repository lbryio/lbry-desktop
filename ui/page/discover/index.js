import * as CS from 'constants/claim_search';
import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { doFetchActiveLivestreams } from 'redux/actions/livestream';
import { selectActiveLivestreams } from 'redux/selectors/livestream';
import { selectOdyseeMembershipIsPremiumPlus } from 'redux/selectors/user';
import { selectFollowedTags } from 'redux/selectors/tags';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import { selectClientSetting, selectLanguage } from 'redux/selectors/settings';
import Tags from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const repostedUriInUrl = urlParams.get(CS.REPOSTED_URI_KEY);
  const repostedUri = repostedUriInUrl ? decodeURIComponent(repostedUriInUrl) : undefined;

  return {
    followedTags: selectFollowedTags(state),
    repostedUri: repostedUri,
    repostedClaim: repostedUri ? makeSelectClaimForUri(repostedUri)(state) : null,
    tileLayout: selectClientSetting(state, SETTINGS.TILE_LAYOUT),
    activeLivestreams: selectActiveLivestreams(state),
    userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
    languageSetting: selectLanguage(state),
    searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
  };
};

export default connect(select, {
  doToggleTagFollowDesktop,
  doResolveUri,
  doFetchActiveLivestreams,
})(Tags);
