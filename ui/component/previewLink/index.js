import { connect } from 'react-redux';
import {
  selectClaimIsMine,
  selectTitleForUri,
  selectClaimForUri,
  selectIsUriResolving,
  makeSelectMetadataItemForUri,
} from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { selectBlackListedOutpoints } from 'lbryinc';
import { getThumbnailFromClaim } from 'util/claim';
import PreviewLink from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    uri: props.uri,
    claim,
    title: selectTitleForUri(state, props.uri),
    thumbnail: getThumbnailFromClaim(claim),
    description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
    channelIsMine: selectClaimIsMine(state, claim),
    isResolvingUri: selectIsUriResolving(state, props.uri),
    blackListedOutpoints: selectBlackListedOutpoints(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(PreviewLink);
