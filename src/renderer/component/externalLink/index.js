import { connect } from 'react-redux';
import { doNotify } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import ExternalLink from './view';

const select = () => ({});
const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
});

export default connect(select, perform)(ExternalLink);
