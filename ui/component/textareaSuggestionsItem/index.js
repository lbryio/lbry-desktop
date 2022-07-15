import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import TextareaSuggestionsItem from './view';
import { formatLbryChannelName } from 'util/url';
import { getClaimTitle } from 'util/claim';

const select = (state, props) => {
  const { uri } = props;

  const claim = uri && selectClaimForUri(state, uri);

  return {
    claimLabel: claim && formatLbryChannelName(claim.canonical_url),
    claimTitle: claim && getClaimTitle(claim),
  };
};

export default connect(select)(TextareaSuggestionsItem);
