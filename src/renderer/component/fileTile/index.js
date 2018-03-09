import React from 'react';
import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doResolveUri } from 'redux/actions/content';
import { makeSelectClaimForUri, makeSelectMetadataForUri } from 'redux/selectors/claims';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { selectShowNsfw } from 'redux/selectors/settings';
import { makeSelectIsUriResolving, selectRewardContentClaimIds } from 'redux/selectors/content';
import FileTile from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isDownloaded: !!makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(FileTile);
