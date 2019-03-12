import { connect } from 'react-redux';
import { PAGE_SIZE } from 'constants/claim';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectTotalPagesForChannel,
} from 'lbry-redux';
import { selectBlackListedOutpoints } from 'lbryinc';
import ShowPage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  blackListedOutpoints: selectBlackListedOutpoints(state),
  totalPages: makeSelectTotalPagesForChannel(props.uri, PAGE_SIZE)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(ShowPage);
