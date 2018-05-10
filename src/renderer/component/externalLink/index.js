import { connect } from 'react-redux';
import { doNotify } from 'lbry-redux';
import ExternalLink from './view';

const select = () => ({});
const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
});

export default connect(select, perform)(ExternalLink);
