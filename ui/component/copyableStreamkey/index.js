import { connect } from 'react-redux';
import { doToast } from 'redux/actions/notifications';
import CopyableText from './view';

export default connect(null, {
  doToast,
})(CopyableText);
