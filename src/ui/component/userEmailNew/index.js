import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { selectEmailNewIsPending, selectEmailNewErrorMessage, doUserEmailNew } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import UserEmailNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserEmailNew(email)),
  setSync: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, value)),
});

export default connect(
  select,
  perform
)(UserEmailNew);
