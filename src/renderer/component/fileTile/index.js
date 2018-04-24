import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
  makeSelectFileInfoForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doClearPublish, doUpdatePublishForm } from 'redux/actions/publish';
import { selectRewardContentClaimIds } from 'redux/selectors/content';
import FileTile from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isDownloaded: !!makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
});

const perform = dispatch => ({
  clearPublish: () => dispatch(doClearPublish()),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(FileTile);
