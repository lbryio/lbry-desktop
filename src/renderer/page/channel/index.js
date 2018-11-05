import { connect } from 'react-redux';
import { doFetchClaimsByChannel, doFetchClaimCountByChannel } from 'redux/actions/content';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
  makeSelectCurrentParam,
  makeSelectClaimIsMine,
  makeSelectTotalPagesForChannel,
  selectCurrentParams,
  doNotify,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import ChannelPage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimsInChannel: makeSelectClaimsInChannelForCurrentPage(props.uri)(state),
  fetching: makeSelectFetchingChannelClaims(props.uri)(state),
  page: makeSelectCurrentParam('page')(state),
  params: selectCurrentParams(state),
  totalPages: makeSelectTotalPagesForChannel(props.uri, PAGE_SIZE)(state),
  channelIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
  fetchClaimCount: uri => dispatch(doFetchClaimCountByChannel(uri)),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
});

export default connect(
  select,
  perform
)(ChannelPage);
