import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimsInChannelForCurrentPageState,
  makeSelectFetchingChannelClaims,
  makeSelectClaimIsMine,
  makeSelectTotalPagesForChannel,
} from 'lbry-redux';
import ChannelPage from './view';

const select = (state, props) => ({
  claimsInChannel: makeSelectClaimsInChannelForCurrentPageState(props.uri)(state),
  fetching: makeSelectFetchingChannelClaims(props.uri)(state),
  totalPages: makeSelectTotalPagesForChannel(props.uri, PAGE_SIZE)(state),
  channelIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
});

export default connect(
  select,
  perform
)(ChannelPage);
