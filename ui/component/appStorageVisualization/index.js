import { connect } from 'react-redux';
import StorageViz from './view';
import {
  selectViewBlobSpace,
  selectViewHostingLimit,
  selectAutoBlobSpace,
  selectPrivateBlobSpace,
  selectAutoHostingLimit,
} from 'redux/selectors/settings';
import { selectDiskSpace } from 'redux/selectors/app';

const select = (state) => ({
  diskSpace: selectDiskSpace(state),
  viewHostingLimit: selectViewHostingLimit(state),
  autoHostingLimit: selectAutoHostingLimit(state),
  viewBlobSpace: selectViewBlobSpace(state),
  autoBlobSpace: selectAutoBlobSpace(state),
  privateBlobSpace: selectPrivateBlobSpace(state),
});

export default connect(select)(StorageViz);
