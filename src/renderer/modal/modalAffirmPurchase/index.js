import { connect } from 'react-redux';
import { doLoadVideo, doSetPlayingUri } from 'redux/actions/content';
import { doCloseModal, makeSelectMetadataForUri } from 'lbry-redux';
import ModalAffirmPurchase from './view';

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  cancelPurchase: () => {
    dispatch(doSetPlayingUri(null));
    dispatch(doCloseModal());
  },
  closeModal: () => dispatch(doCloseModal()),
  loadVideo: uri => dispatch(doLoadVideo(uri)),
});

export default connect(select, perform)(ModalAffirmPurchase);
