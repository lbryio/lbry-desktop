import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectEmailToVerify, selectUser } from 'redux/selectors/user';
import FirstRunEmailCollection from './view';
import * as SETTINGS from 'constants/settings';

const select = (state) => ({
  emailCollectionAcknowledged: selectClientSetting(state, SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED),
  email: selectEmailToVerify(state),
  user: selectUser(state),
});

const perform = (dispatch) => () => ({
  acknowledgeEmail: () => {
    dispatch(doSetClientSetting(SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED, true));
  },
});

export default connect(select, perform)(FirstRunEmailCollection);
