import { connect } from 'react-redux';
import { doNotify } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import ReportContentPage from './view';

const select = () => ({});

const perform = dispatch => ({
  doNotify: message => dispatch(doNotify(message)),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(select, perform)(ReportContentPage);
