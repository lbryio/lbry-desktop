import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { selectPrimaryUri, makeSelectContentWatchedPercentageForUri } from 'redux/selectors/content';
import CardMedia from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => {
  const claimUriBeingPlayed = selectPrimaryUri(state);
  let isBeingPlayed = false;

  if (claimUriBeingPlayed) {
    const claim = makeSelectClaimForUri(props.uri)(state);
    const claimBeingPlayed = makeSelectClaimForUri(claimUriBeingPlayed)(state);
    isBeingPlayed = claim.claim_id === claimBeingPlayed.claim_id;
  }

  return {
    watchedPercentage: makeSelectContentWatchedPercentageForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    showPercentage: !isBeingPlayed && makeSelectClientSetting(SETTINGS.PERSIST_WATCH_TIME)(state),
  };
};

export default connect(select, { doResolveUri })(CardMedia);
