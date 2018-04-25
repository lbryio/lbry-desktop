import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectRewardContentClaimIds } from 'redux/selectors/content';
import { selectShowNsfw } from 'redux/selectors/settings';
import { selectPendingPublish } from 'redux/selectors/publish';
import FileCard from './view';

const select = (state, props) => {
  let pendingPublish;
  if (props.checkPending) {
    pendingPublish = selectPendingPublish(props.uri)(state);
  }

  const fileCardInfo = pendingPublish || {
    claim: makeSelectClaimForUri(props.uri)(state),
    fileInfo: makeSelectFileInfoForUri(props.uri)(state),
    metadata: makeSelectMetadataForUri(props.uri)(state),
    isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  };

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
