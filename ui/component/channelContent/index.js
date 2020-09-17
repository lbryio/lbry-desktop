import { connect } from 'react-redux';
import { PAGE_SIZE } from 'constants/claim';
import {
  makeSelectClaimsInChannelForPage,
  makeSelectFetchingChannelClaims,
  makeSelectClaimIsMine,
  makeSelectTotalPagesInChannelSearch,
  makeSelectClaimForUri,
  SETTINGS,
} from 'lbry-redux';
import { selectChannelIsBlocked } from 'redux/selectors/blocked';
import { withRouter } from 'react-router';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { makeSelectClientSetting } from 'redux/selectors/settings';

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
    showMature: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
    tileLayout: makeSelectClientSetting(SETTINGS.TILE_LAYOUT)(state),
  };
};

export default withRouter(connect(select)(ChannelPage));
