import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import { selectUserVerifiedEmail } from 'lbryinc';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import * as CS from 'constants/claim_search';
import Discover from './view';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const repostedClaimId = urlParams.get(CS.REPOSTED_CLAIM_ID_KEY);

  return {
    followedTags: selectFollowedTags(state),
    repostedClaimId: repostedClaimId,
    isAuthenticated: selectUserVerifiedEmail(state),
  };
};

export default connect(select, {
  doToggleTagFollowDesktop,
})(Discover);
