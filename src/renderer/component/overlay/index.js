import { connect } from 'react-redux';
import { selectShowOverlay } from 'redux/selectors/media';
import Overlay from './view';

const select = state => ({
  showOverlay: selectShowOverlay(state),
});

export default connect(
  select,
  null
)(Overlay);
