import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
  makeSelectCurrentParam,
  makeSelectClaimIsMine,
  makeSelectTotalPagesForChannel,
  selectCurrentParams,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doOpenModal } from 'redux/actions/app';
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
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(
  select,
  perform
)(ChannelPage);
