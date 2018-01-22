import { connect } from 'react-redux';
import { selectShowNsfw } from 'redux/selectors/settings';
import {
  doNavigate,
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { selectRewardContentClaimIds } from 'redux/selectors/content';
import FileCard from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(FileCard);
