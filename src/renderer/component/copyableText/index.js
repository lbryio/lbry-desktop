import { connect } from 'react-redux';
import { doNotify } from 'lbry-redux';
import CopyableText from './view';

export default connect(
  null,
  {
    doNotify,
  }
)(CopyableText);
