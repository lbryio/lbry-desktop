import { connect } from 'react-redux';
import { makeSelectThumbnailForUri, makeSelectClaimForUri, makeSelectIsUriResolving } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolving: makeSelectIsUriResolving(props.uri)(state),
});

export default connect(select, {
  doResolveUri,
})(ChannelThumbnail);
