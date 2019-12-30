import { connect } from 'react-redux';
import { doToast } from 'lbry-redux';
import EmbedTextArea from './view';

export default connect(
  null,
  {
    doToast,
  }
)(EmbedTextArea);
