import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import ModalFirstSubscription from './view';

const perform = dispatch => () => ({
  closeModal: () => dispatch(doHideNotification()),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(null, perform)(ModalFirstSubscription);
