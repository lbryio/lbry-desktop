import { connect } from 'react-redux';
import { doFetchClaimsByChannel } from 'redux/actions/content';
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
