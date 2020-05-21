import { connect } from 'react-redux';
import { doPlayUri } from 'redux/actions/content';
import { doHideModal, doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { makeSelectMetadataForUri } from 'lbry-redux';
import ModalAffirmPurchase from './view';

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  analyticsPurchaseEvent: fileInfo => dispatch(doAnaltyicsPurchaseEvent(fileInfo)),
  cancelPurchase: () => {
    // TODO: Find a way to add this back without messing up embeds
    // dispatch(doSetPlayingUri(null));
    dispatch(doHideModal());
  },
  closeModal: () => dispatch(doHideModal()),
  loadVideo: (uri, onSuccess) => dispatch(doPlayUri(uri, true, undefined, onSuccess)),
});

export default connect(select, perform)(ModalAffirmPurchase);
