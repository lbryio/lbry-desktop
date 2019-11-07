import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectEmailToVerify, selectUser } from 'lbryinc';
import FirstRunEmailCollection from './view';

const select = state => ({
  emailCollectionAcknowledged: makeSelectClientSetting(SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED)(state),
  email: selectEmailToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  acknowledgeEmail: () => {
    dispatch(doSetClientSetting(SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED, true));
  },
});

export default connect(
  select,
  perform
)(FirstRunEmailCollection);
