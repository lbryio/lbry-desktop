import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectContentTypeForUri,
  makeSelectStreamingUrlForUri,
  makeSelectMediaTypeForUri,
  makeSelectDownloadPathForUri,
  makeSelectFileNameForUri,
} from 'lbry-redux';
import { THEME, AUTOPLAY } from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectNextUnplayedRecommended } from 'redux/selectors/content';
import FileRender from './view';

const select = (state, props) => ({
  currentTheme: makeSelectClientSetting(THEME)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  downloadPath: makeSelectDownloadPathForUri(props.uri)(state),
  fileName: makeSelectFileNameForUri(props.uri)(state),
  streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  autoplay: makeSelectClientSetting(AUTOPLAY)(state),
  nextUnplayed: makeSelectNextUnplayedRecommended(props.uri)(state),
});

export default connect(select)(FileRender);
