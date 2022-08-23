import AdsSticky from './view';
import { connect } from 'react-redux';
import { selectShouldShowAds } from 'redux/selectors/app';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectAnyNagsShown } from 'redux/selectors/notifications';
import { selectHomepageData } from 'redux/selectors/settings';
import { selectUserVerifiedEmail, selectUserLocale } from 'redux/selectors/user';
import { isChannelClaim, isStreamPlaceholderClaim } from 'util/claim';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    isContentClaim: isStreamPlaceholderClaim(claim) || Boolean(claim?.value?.source?.media_type),
    isChannelClaim: isChannelClaim(claim),
    authenticated: selectUserVerifiedEmail(state),
    homepageData: selectHomepageData(state),
    locale: selectUserLocale(state),
    nagsShown: selectAnyNagsShown(state),
    shouldShowAds: selectShouldShowAds(state),
  };
};

export default connect(select)(AdsSticky);
