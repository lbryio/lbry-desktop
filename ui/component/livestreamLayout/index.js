import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectThumbnailForUri } from 'lbry-redux';
import LivestreamLayout from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
});

export default connect(select)(LivestreamLayout);
