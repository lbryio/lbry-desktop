import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  selectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectMetadataItemForUri,
} from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { selectBlackListedOutpoints } from 'lbryinc';
import PreviewLink from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    uri: props.uri,
    claim,
    title: makeSelectTitleForUri(props.uri)(state),
    thumbnail: makeSelectThumbnailForUri(props.uri)(state),
    description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
    channelIsMine: selectClaimIsMine(state, claim),
    isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(PreviewLink);
