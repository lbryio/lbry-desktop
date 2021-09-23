import { connect } from 'react-redux';
import { doToast } from 'redux/actions/notifications';
import CopyableStreamkey from './view';

export default connect(null, {
  doToast,
})(CopyableStreamkey);
