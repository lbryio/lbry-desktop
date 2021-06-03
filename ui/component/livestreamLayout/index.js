import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectTagInClaimOrChannelForUri, makeSelectThumbnailForUri } from 'lbry-redux';
import LivestreamLayout from './view';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  chatDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
});

export default connect(select)(LivestreamLayout);
