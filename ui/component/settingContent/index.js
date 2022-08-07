import { connect } from 'react-redux';
import { selectMyChannelUrls } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { doSetPlayingUri, clearContentCache } from 'redux/actions/content';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectShowMatureContent, makeSelectClientSetting } from 'redux/selectors/settings';

import SettingContent from './view';

const select = (state) => ({
  floatingPlayer: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  autoplayMedia: makeSelectClientSetting(SETTINGS.AUTOPLAY_MEDIA)(state),
  autoplayNext: makeSelectClientSetting(SETTINGS.AUTOPLAY_NEXT)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  persistWatchTime: makeSelectClientSetting(SETTINGS.PERSIST_WATCH_TIME)(state),
  showNsfw: selectShowMatureContent(state),
  myChannelUrls: selectMyChannelUrls(state),
  instantPurchaseEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  clearContentCache: () => dispatch(clearContentCache()),
});

export default connect(select, perform)(SettingContent);
