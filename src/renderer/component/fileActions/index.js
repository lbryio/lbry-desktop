import React from 'react';
import { connect } from 'react-redux';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { makeSelectCostInfoForUri } from 'redux/selectors/cost_info';
import { doOpenModal } from 'redux/actions/app';
import { makeSelectClaimIsMine } from 'redux/selectors/claims';
import FileActions from './view';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  /* availability check is disabled due to poor performance, TBD if it dies forever or requires daemon fix */
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(FileActions);
