import { connect } from 'react-redux';
import { doAuthNavigate } from 'redux/actions/navigation';
import { doFetchAccessToken, selectAccessToken, selectUser } from 'lbryinc';
import { selectDaemonSettings } from 'redux/selectors/settings';
import HelpPage from './view';

const select = state => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  deamonSettings: selectDaemonSettings(state),
});

const perform = dispatch => ({
  doAuth: () => dispatch(doAuthNavigate('/help')),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(
  select,
  perform
)(HelpPage);
