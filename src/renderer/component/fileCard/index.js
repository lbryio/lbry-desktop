import React from 'react';
import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doResolveUri } from 'redux/actions/content';
import { selectShowNsfw } from 'redux/selectors/settings';
import { makeSelectClaimForUri, makeSelectMetadataForUri } from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { makeSelectIsUriResolving, selectRewardContentClaimIds } from 'redux/selectors/content';
import FileCard from './view';

const select = (state, props) => {
  let claim;
  let fileInfo;
  let metadata;
  let isResolvingUri;
  
  // If a publish is pending, don't bother with this because props.uri isn't the complete uri at that moment
  if (!props.pending) {
    claim = makeSelectClaimForUri(props.uri)(state);
    fileInfo = makeSelectFileInfoForUri(props.uri)(state);
    metadata = makeSelectMetadataForUri(props.uri)(state);
    isResolvingUri = makeSelectIsUriResolving(props.uri)(state);
  }
  
  return {
    claim,
    fileInfo,
    obscureNsfw: !selectShowNsfw(state),
    metadata,
    rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
    isResolvingUri,
  }
};

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(FileCard);
