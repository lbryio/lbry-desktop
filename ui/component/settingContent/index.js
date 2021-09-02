import { connect } from 'react-redux';
import { selectMyChannelUrls, SETTINGS } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectShowMatureContent, selectLanguage, makeSelectClientSetting } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

import SettingContent from './view';

const select = (state) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  floatingPlayer: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  autoplayMedia: makeSelectClientSetting(SETTINGS.AUTOPLAY_MEDIA)(state),
  autoplayNext: makeSelectClientSetting(SETTINGS.AUTOPLAY_NEXT)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  showNsfw: selectShowMatureContent(state),
  myChannelUrls: selectMyChannelUrls(state),
  instantPurchaseEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
  language: selectLanguage(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  openModal: (id, params) => dispatch(doOpenModal(id, params)),
});

export default connect(select, perform)(SettingContent);
