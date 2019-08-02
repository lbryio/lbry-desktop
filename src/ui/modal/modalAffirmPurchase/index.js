import { connect } from 'react-redux';
import { doSetPlayingUri } from 'redux/actions/content';
import { doHideModal } from 'redux/actions/app';
import { makeSelectMetadataForUri } from 'lbry-redux';
import ModalAffirmPurchase from './view';

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  cancelPurchase: () => {
    dispatch(doSetPlayingUri(null));
    dispatch(doHideModal());
  },
  closeModal: () => dispatch(doHideModal()),
  loadVideo: uri => {
    throw Error('sean you need to fix this');
  },
});

export default connect(
  select,
  perform
)(ModalAffirmPurchase);
