import { connect } from 'react-redux';
import { selectDaemonSettings } from 'redux/selectors/settings';
import HelpPage from './view';

const select = (state) => ({
  deamonSettings: selectDaemonSettings(state),
});

export default connect(select)(HelpPage);
