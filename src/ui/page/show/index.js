import { connect } from 'react-redux';
import { PAGE_SIZE } from 'constants/claim';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectTotalPagesForChannel,
  normalizeURI,
} from 'lbry-redux';
import { selectBlackListedOutpoints } from 'lbryinc';
import ShowPage from './view';

const select = (state, props) => {
  const { pathname } = props.location;
  // Remove the leading "/" added by the browser
  const path = pathname.slice(1).replace(/:/g, '#');

  let uri;
  try {
    uri = normalizeURI(path);
  } catch (e) {
    // Probably an old channel url, redirect to the vanity channel
    // @routinghax
    const match = path.match(/[#/:]/);
    if (match && match.index) {
      uri = `lbry://${path.slice(0, match.index)}`;
      props.history.replace(`/${path.slice(0, match.index)}`);
    }
  }

  return {
    claim: makeSelectClaimForUri(uri)(state),
    isResolvingUri: makeSelectIsUriResolving(uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    totalPages: makeSelectTotalPagesForChannel(uri, PAGE_SIZE)(state),
    uri,
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(ShowPage);
