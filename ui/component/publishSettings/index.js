import { SETTINGS } from 'lbry-redux';
import { connect } from 'react-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import PublishSettings from './view';

const select = state => ({
  enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
});

const perform = dispatch => ({
  setEnablePublishPreview: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, value)),
});

export default connect(select, perform)(PublishSettings);
