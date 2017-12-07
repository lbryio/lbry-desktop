import { connect } from "react-redux";
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
} from "redux/selectors/file_info";
import { selectCurrentPage } from "redux/selectors/navigation";
import { selectPlayingUri } from "redux/selectors/content";
import VideoOverlay from "./view";

const select = (state, props) => ({
  playingUri: selectPlayingUri(state),
  currentPage: selectCurrentPage(state),
  isDownloading: uri => makeSelectDownloadingForUri(uri)(state),
  isLoading: uri => makeSelectLoadingForUri(uri)(state),
  fileInfo: uri => makeSelectFileInfoForUri(uri)(state),
});

export default connect(select, null)(VideoOverlay);
