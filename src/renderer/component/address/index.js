import { connect } from 'react-redux';
import { doNotify } from 'lbry-redux';
import Address from './view';

export default connect(null, {
  doNotify,
})(Address);
