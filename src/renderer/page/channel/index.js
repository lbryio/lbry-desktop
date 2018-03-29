import React from 'react';
import { connect } from 'react-redux';
import { doFetchClaimsByChannel, doFetchClaimCountByChannel } from 'redux/actions/content';
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
} from 'redux/selectors/claims';
import { makeSelectCurrentParam, selectCurrentParams } from 'redux/selectors/navigation';
import { doNavigate } from 'redux/actions/navigation';
import { makeSelectTotalPagesForChannel } from 'redux/selectors/content';
import { doOpenModal } from 'redux/actions/app';
import ChannelPage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimsInChannel: makeSelectClaimsInChannelForCurrentPage(props.uri)(state),
  fetching: makeSelectFetchingChannelClaims(props.uri)(state),
  page: makeSelectCurrentParam('page')(state),
  params: selectCurrentParams(state),
  totalPages: makeSelectTotalPagesForChannel(props.uri)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
  fetchClaimCount: uri => dispatch(doFetchClaimCountByChannel(uri)),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(ChannelPage);
