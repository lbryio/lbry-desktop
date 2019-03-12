import { connect } from 'react-redux';
import { makeSelectFileInfoForUri, makeSelectClaimIsMine } from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
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

export default connect(
  select,
  perform
)(FileActions);
