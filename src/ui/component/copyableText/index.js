import { connect } from 'react-redux';
import { doToast } from 'lbry-redux';
import CopyableText from './view';

export default connect(
  null,
  {
    doToast,
  }
)(CopyableText);
