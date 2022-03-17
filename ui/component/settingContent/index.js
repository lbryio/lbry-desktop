import { connect } from 'react-redux';
import { selectMyChannelUrls } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { doOpenModal } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { doFetchPersonalRecommendations } from 'redux/actions/search';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectPersonalRecommendations } from 'redux/selectors/search';
import { selectShowMatureContent, selectClientSetting } from 'redux/selectors/settings';
import { selectHasOdyseeMembership, selectUserVerifiedEmail } from 'redux/selectors/user';

import SettingContent from './view';

const select = (state) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  floatingPlayer: selectClientSetting(state, SETTINGS.FLOATING_PLAYER),
  autoplayMedia: selectClientSetting(state, SETTINGS.AUTOPLAY_MEDIA),
  autoplayNext: selectClientSetting(state, SETTINGS.AUTOPLAY_NEXT),
  hideReposts: selectClientSetting(state, SETTINGS.HIDE_REPOSTS),
  hideScheduledLivestreams: selectClientSetting(state, SETTINGS.HIDE_SCHEDULED_LIVESTREAMS),
  hideFyp: selectClientSetting(state, SETTINGS.HIDE_FYP),
  showNsfw: selectShowMatureContent(state),
  myChannelUrls: selectMyChannelUrls(state),
  instantPurchaseEnabled: selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_ENABLED),
  instantPurchaseMax: selectClientSetting(state, SETTINGS.INSTANT_PURCHASE_MAX),
  enablePublishPreview: selectClientSetting(state, SETTINGS.ENABLE_PUBLISH_PREVIEW),
  hasMembership: selectHasOdyseeMembership(state),
  personalRecommendations: selectPersonalRecommendations(state),
});

const perform = (dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  openModal: (id, params) => dispatch(doOpenModal(id, params)),
  doFetchPersonalRecommendations: () => dispatch(doFetchPersonalRecommendations()),
});

export default connect(select, perform)(SettingContent);
