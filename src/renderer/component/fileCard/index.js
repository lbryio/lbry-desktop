import React from 'react';
import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doResolveUri } from 'redux/actions/content';
import { selectShowNsfw } from 'redux/selectors/settings';
import { makeSelectClaimForUri, makeSelectMetadataForUri } from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { makeSelectIsUriResolving, selectRewardContentClaimIds } from 'redux/selectors/content';
import { selectPendingPublish } from 'redux/selectors/publish';
import FileCard from './view';

const select = (state, props) => {
  let claim;
  let fileInfo;
  let metadata;
  let isResolvingUri;

  const pendingPublish = selectPendingPublish(props.uri)(state);

  let fileCardInfo = pendingPublish || {
    claim: makeSelectClaimForUri(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  }

  return {
    obscureNsfw: !selectShowNsfw(state),
    rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
    ...fileCardInfo,
    pending: !!pendingPublish,
  };
};

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(FileCard);
