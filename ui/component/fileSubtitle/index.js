import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectNoRestrictionOrUserIsMemberForContentClaimId } from 'redux/selectors/memberships';

import FileSubtitle from './view';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);

  return {
    contentUnlocked: claim && selectNoRestrictionOrUserIsMemberForContentClaimId(state, claim.claim_id),
  };
};

export default connect(select)(FileSubtitle);
