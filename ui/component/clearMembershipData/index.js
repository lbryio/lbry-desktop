import { connect } from 'react-redux';
import { doMembershipClearData } from 'redux/actions/memberships';

import ClearMembershipDataButton from './view';

const perform = {
  doMembershipClearData,
};

export default connect(null, perform)(ClearMembershipDataButton);
