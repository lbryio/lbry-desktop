import { connect } from 'react-redux';
import { doToast } from 'lbry-redux';
import EmbedArea from './view';

export default connect(
  null,
  {
    doToast,
  }
)(EmbedArea);
