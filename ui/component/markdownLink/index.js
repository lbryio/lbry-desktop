import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import MarkdownLink from './view';

const select = (state, props) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(MarkdownLink);
