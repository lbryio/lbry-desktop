import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doDeactivateMembershipForId, doMembershipList } from 'redux/actions/memberships';
import { doToast } from 'redux/actions/notifications';
import TiersTab from './view';

const perform = {
  doOpenModal,
  doToast,
  doDeactivateMembershipForId,
  doMembershipList,
};

export default connect(null, perform)(TiersTab);
