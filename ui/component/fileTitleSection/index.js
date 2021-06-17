import { connect } from 'react-redux';
import { makeSelectTitleForUri, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import { makeSelectViewersForId } from 'redux/selectors/livestream';
import FileTitleSection from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const viewers = claim && makeSelectViewersForId(claim.claim_id)(state);
  return {
    viewers,
    isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
    title: makeSelectTitleForUri(props.uri)(state),
  };
};

export default connect(select)(FileTitleSection);
