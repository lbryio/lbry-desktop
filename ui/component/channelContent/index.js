import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimsInChannelForPage,
  makeSelectFetchingChannelClaims,
  makeSelectClaimIsMine,
  makeSelectTotalPagesForChannel,
  selectChannelIsBlocked,
} from 'lbry-redux';
import { withRouter } from 'react-router';
import ChannelPage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = urlParams.get('page') || 0;
  return {
    claimsInChannel: makeSelectClaimsInChannelForPage(props.uri, page)(state),
    fetching: makeSelectFetchingChannelClaims(props.uri)(state),
    totalPages: makeSelectTotalPagesForChannel(props.uri, PAGE_SIZE)(state),
    channelIsMine: makeSelectClaimIsMine(props.uri)(state),
    channelIsBlocked: selectChannelIsBlocked(props.uri)(state),
  };
};

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
});

export default withRouter(
  connect(
    select,
    perform
  )(ChannelPage)
);
