import { connect } from 'react-redux';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';
import Page from './view';

const select = state => ({
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
});

export default connect(
  select,
  {
    doDownloadUpgradeRequested,
  }
)(Page);
