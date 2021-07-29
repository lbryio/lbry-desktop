import { connect } from 'react-redux';
import { doResolveUri, makeSelectTitleForUri, makeSelectClaimForUri, makeSelectIsUriResolving } from 'lbry-redux';
import { selectBlackListedOutpoints } from 'lbryinc';
import { selectPlayingUri } from 'redux/selectors/content';
import { doSetPlayingUri } from 'redux/actions/content';
import ClaimLink from './view';

const select = (state, props) => {
  return {
    uri: props.uri,
    claim: makeSelectClaimForUri(props.uri)(state),
    title: makeSelectTitleForUri(props.uri)(state),
    isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    playingUri: selectPlayingUri(state),
  };
};

export default connect(select, {
  doResolveUri,
  doSetPlayingUri,
})(ClaimLink);
