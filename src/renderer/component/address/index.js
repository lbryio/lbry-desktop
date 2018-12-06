// @flow

import { connect } from 'react-redux';
import { doToast } from 'lbry-redux';
import Address from './view';

export default connect(
  null,
  {
    doToast,
  }
)(Address);
