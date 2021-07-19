import { connect } from 'react-redux';
import EmbedWrapperPage from './view';
import {
  doResolveUri,
  makeSelectClaimForUri,
  buildURI,
  makeSelectStreamingUrlForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { doPlayUri } from 'redux/actions/content';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri, selectBlackListedOutpoints } from 'lbryinc';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { claimName, claimId } = params;
  const uri = claimName ? buildURI({ claimName, claimId }) : '';
  return {
    uri,
    claim: makeSelectClaimForUri(uri)(state),
    costInfo: makeSelectCostInfoForUri(uri)(state),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    isResolvingUri: makeSelectIsUriResolving(uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
  };
};

const perform = dispatch => {
  return {
    resolveUri: uri => dispatch(doResolveUri(uri)),
    doPlayUri: uri => dispatch(doPlayUri(uri)),
    doFetchCostInfoForUri: uri => dispatch(doFetchCostInfoForUri(uri)),
  };
};

export default connect(select, perform)(EmbedWrapperPage);
