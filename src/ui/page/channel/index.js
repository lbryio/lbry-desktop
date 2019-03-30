import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForCurrentPageState,
  makeSelectFetchingChannelClaims,
  makeSelectClaimIsMine,
  makeSelectTotalPagesForChannel,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import ChannelPage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimsInChannel: makeSelectClaimsInChannelForCurrentPageState(props.uri)(state),
  fetching: makeSelectFetchingChannelClaims(props.uri)(state),
  totalPages: makeSelectTotalPagesForChannel(props.uri, PAGE_SIZE)(state),
  channelIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(
  select,
  perform
)(ChannelPage);
