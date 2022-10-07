import * as CS from 'constants/claim_search';
import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { doFetchActiveLivestreams } from 'redux/actions/livestream';
import { selectActiveLivestreams } from 'redux/selectors/livestream';
import { selectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { selectUserHasOdyseePremiumPlus } from 'redux/selectors/memberships';
import DiscoverPage from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const repostedUriInUrl = urlParams.get(CS.REPOSTED_URI_KEY);
  const repostedUri = repostedUriInUrl ? decodeURIComponent(repostedUriInUrl) : undefined;

  return {
    repostedUri: repostedUri,
    repostedClaim: repostedUri ? makeSelectClaimForUri(repostedUri)(state) : null,
    tileLayout: selectClientSetting(state, SETTINGS.TILE_LAYOUT),
    activeLivestreams: selectActiveLivestreams(state),
    languageSetting: selectLanguage(state),
    searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
    hasPremiumPlus: selectUserHasOdyseePremiumPlus(state),
  };
};

export default connect(select, {
  doResolveUri,
  doFetchActiveLivestreams,
})(DiscoverPage);
