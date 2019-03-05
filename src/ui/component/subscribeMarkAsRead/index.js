import { connect } from 'react-redux';
import { doRemoveUnreadSubscriptions } from 'redux/actions/subscriptions';
import MarkAsRead from './view';

export default connect(
  null,
  {
    doRemoveUnreadSubscriptions,
  }
)(MarkAsRead);
