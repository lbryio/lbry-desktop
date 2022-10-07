import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectUserValidMembershipForChannelUri } from 'redux/selectors/memberships';

import MembershipBadge from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    validUserMembershipForChannel: selectUserValidMembershipForChannelUri(state, uri),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(MembershipBadge);
