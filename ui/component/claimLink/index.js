import { connect } from 'react-redux';
import { doResolveUri, makeSelectClaimForUri, makeSelectIsUriResolving } from 'lbry-redux';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectBlackListedOutpoints } from 'lbryinc';
import { selectPlayingUri } from 'redux/selectors/content';
import ClaimLink from './view';

const select = (state, props) => {
  let uri = props.uri;
  let claim;

  function getValidClaim(testUri) {
    claim = makeSelectClaimForUri(testUri)(state);
    if (claim === null) {
      getValidClaim(testUri.substring(0, testUri.length - 1));
    } else {
      uri = testUri;
    }
  }
  getValidClaim(uri);

  return {
    uri,
    claim,
    fullUri: props.uri,
    isResolvingUri: makeSelectIsUriResolving(uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    playingUri: selectPlayingUri(state),
  };
};

export default connect(select, { doResolveUri, doSetPlayingUri })(ClaimLink);
