import { connect } from 'react-redux';
import { doToast } from 'redux/actions/notifications';
import EmbedTextArea from './view';

export default connect(null, {
  doToast,
})(EmbedTextArea);
