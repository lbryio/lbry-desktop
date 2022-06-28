import { connect } from 'react-redux';
import { selectRemoteVersion } from 'redux/selectors/app';
import { doDownloadUpgrade, doSkipUpgrade, doHideModal } from 'redux/actions/app';
import ModalUpgrade from './view';

const select = (state) => ({
  releaseVersion: selectRemoteVersion(state),
});

const perform = (dispatch) => ({
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
  skipUpgrade: () => {
    dispatch(doHideModal());
    dispatch(doSkipUpgrade());
  },
});

export default connect(select, perform)(ModalUpgrade);
