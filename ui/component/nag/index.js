import Nag from './view';
import { connect } from 'react-redux';
import { doUpdateVisibleNagIds } from 'redux/actions/notifications';

const perform = {
  doUpdateVisibleNagIds,
};

export default connect(null, perform)(Nag);
