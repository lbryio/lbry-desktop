import { connect } from 'react-redux';
import { selectPublishFormValues, doUpdatePublishForm } from 'lbry-redux';
import PublishAdditionalOptions from './view';
import { selectUser, selectAccessToken } from 'redux/selectors/user';
import { doFetchAccessToken } from 'redux/actions/user';

const select = (state) => ({
  ...selectPublishFormValues(state),
  accessToken: selectAccessToken(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(select, perform)(PublishAdditionalOptions);
