import { connect } from 'react-redux';
import { PAGE_SIZE } from 'constants/claim';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectTotalPagesForChannel,
  buildURI,
} from 'lbry-redux';
import { selectBlackListedOutpoints } from 'lbryinc';
import ShowPage from './view';

const select = (state, props) => {
  const { pathname } = props.location;
  const urlParts = pathname.split('/');
  const claimName = urlParts[1];
  const claimId = urlParts[2];

  // claimName and claimId come from the url `lbry.tv/{claimName}/{claimId}"
  const uri = buildURI({ contentName: claimName, claimId: claimId });

  return {
    claim: makeSelectClaimForUri(uri)(state),
    isResolvingUri: makeSelectIsUriResolving(uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    totalPages: makeSelectTotalPagesForChannel(uri, PAGE_SIZE)(state),
    uri: uri,
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(ShowPage);
