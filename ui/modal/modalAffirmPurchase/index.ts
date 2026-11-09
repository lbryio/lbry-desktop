//@ts-nocheck
import {connect} from 'react-redux';
import { doPlayUri, doSetPlayingUri } from 'redux/actions/content';
import { selectPlayingUri } from 'redux/selectors/content';
import { doHideModal, doAnaltyicsPurchaseEvent } from 'redux/actions/app';
import { makeSelectMetadataForUri } from 'redux/selectors/claims';
import ModalAffirmPurchase from './view';

const select = (state: unknown, props: unknown) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
  playingUri: selectPlayingUri(state),
});

const perform = (dispatch: unknown) => ({
  analyticsPurchaseEvent: (fileInfo) => dispatch(doAnaltyicsPurchaseEvent(fileInfo)),
  setPlayingUri: (uri) => dispatch(doSetPlayingUri({ uri })),
  closeModal: () => dispatch(doHideModal()),
  loadVideo: (uri, onSuccess) => dispatch(doPlayUri(uri, true, undefined, onSuccess)),
});

export default connect(select, perform)(ModalAffirmPurchase);
