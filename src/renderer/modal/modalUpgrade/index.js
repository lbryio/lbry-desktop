import { connect } from 'react-redux';
import { doDownloadUpgrade, doSkipUpgrade, doHideModal } from 'redux/actions/app';
import ModalUpgrade from './view';

const select = () => ({});

const perform = dispatch => ({
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
  skipUpgrade: () => {
    dispatch(doHideModal());
    dispatch(doSkipUpgrade());
  },
});

export default connect(
  select,
  perform
)(ModalUpgrade);
