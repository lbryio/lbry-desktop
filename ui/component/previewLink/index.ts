//@ts-nocheck
import { connect } from "react-redux";
import {
  selectClaimIsMine,
  selectTitleForUri,
  getThumbnailFromClaim,
  selectClaimForUri,
  selectIsUriResolving,
  makeSelectMetadataItemForUri,
} from "redux/selectors/claims";
import { doResolveUri } from "redux/actions/claims";
import { selectBlackListedOutpoints } from "lbryinc";
import PreviewLink from "./view";

const select = (state: unknown, props: unknown) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    uri: props.uri,
    claim,
    title: selectTitleForUri(state, props.uri),
    thumbnail: getThumbnailFromClaim(claim),
    description: makeSelectMetadataItemForUri(props.uri, "description")(state),
    channelIsMine: selectClaimIsMine(state, claim),
    isResolvingUri: selectIsUriResolving(state, props.uri),
    blackListedOutpoints: selectBlackListedOutpoints(state),
  };
};

const perform = (dispatch: Dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(PreviewLink);
