import { connect } from 'react-redux';
import { selectShowOverlay } from 'redux/selectors/media';
import { doHideOverlay } from 'redux/actions/media';
import Overlay from './view';

const select = state => ({
  showOverlay: selectShowOverlay(state),
});

const perform = dispatch => ({
  doCloseOverlay: dispatch(doHideOverlay()),
});

export default connect(select, perform)(Overlay);
