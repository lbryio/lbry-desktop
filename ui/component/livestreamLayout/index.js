import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectTagInClaimOrChannelForUri,
  selectThumbnailForUri,
} from 'redux/selectors/claims';
import LivestreamLayout from './view';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  thumbnail: selectThumbnailForUri(state, props.uri),
  chatDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
});

export default connect(select)(LivestreamLayout);
