import { connect } from 'react-redux';

import { doResolveUri, makeSelectTitleForUri, makeSelectClaimForUri, makeSelectIsUriResolving } from 'lbry-redux';

import { selectBlackListedOutpoints } from 'lbryinc';

import ClaimLink from './view';

const select = (state, props) => {
  return {
    uri: props.uri,
    claim: makeSelectClaimForUri(props.uri)(state),
    title: makeSelectTitleForUri(props.uri)(state),
    isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(ClaimLink);
