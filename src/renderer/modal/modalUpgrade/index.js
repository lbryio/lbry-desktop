import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { doDownloadUpgrade, doSkipUpgrade } from 'redux/actions/app';
import ModalUpgrade from './view';

const select = () => ({});

const perform = dispatch => ({
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
  skipUpgrade: () => {
    dispatch(doHideNotification());
    dispatch(doSkipUpgrade());
  },
});

export default connect(
  select,
  perform
)(ModalUpgrade);
