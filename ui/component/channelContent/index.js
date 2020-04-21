import { connect } from 'react-redux';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimsInChannelForPage,
  makeSelectFetchingChannelClaims,
  makeSelectClaimIsMine,
  makeSelectTotalPagesInChannelSearch,
  selectChannelIsBlocked,
  makeSelectClaimForUri,
} from 'lbry-redux';
import { withRouter } from 'react-router';
import { selectUserVerifiedEmail } from 'lbryinc';
import ChannelPage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = urlParams.get('page') || 0;
  return {
    pageOfClaimsInChannel: makeSelectClaimsInChannelForPage(props.uri, page)(state),
    fetching: makeSelectFetchingChannelClaims(props.uri)(state),
    totalPages: makeSelectTotalPagesInChannelSearch(props.uri, PAGE_SIZE)(state),
    channelIsMine: makeSelectClaimIsMine(props.uri)(state),
    channelIsBlocked: selectChannelIsBlocked(props.uri)(state),
    claim: props.uri && makeSelectClaimForUri(props.uri)(state),
    isAuthenticated: selectUserVerifiedEmail(state),
  };
};

export default withRouter(connect(select)(ChannelPage));
