import { connect } from 'react-redux';
import { selectStakedLevelForChannelUri, selectClaimForUri, selectMyClaimIdsRaw } from 'redux/selectors/claims';
import LivestreamComment from './view';

const select = (state, props) => {
  const { uri, comment } = props;
  const { channel_url: authorUri } = comment;

  return {
    claim: selectClaimForUri(state, uri),
    stakedLevel: selectStakedLevelForChannelUri(state, authorUri),
    myChannelIds: selectMyClaimIdsRaw(state),
  };
};

export default connect(select)(LivestreamComment);
