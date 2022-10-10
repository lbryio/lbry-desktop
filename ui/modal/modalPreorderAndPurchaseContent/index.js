import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectPlayingUri } from 'redux/selectors/content';
import ModalPreorderAndPurchaseContent from './view';

const select = (state, props) => ({
  playingUri: selectPlayingUri(state),
});

const perform = {
  doHideModal,
  doSetPlayingUri,
};

export default connect(select, perform)(ModalPreorderAndPurchaseContent);
