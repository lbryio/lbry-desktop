import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SettingSearchServer from './view';

const select = (state) => ({
  provider: makeSelectClientSetting(SETTINGS.SEARCH_PROVIDER)(state),
  lbrySearchUrl: makeSelectClientSetting(SETTINGS.LBRY_SEARCH_URL)(state),
});

// Kept on this device, not synced: an lbry-search server is often a local one.
const perform = (dispatch) => ({
  setProvider: (provider) => dispatch(doSetClientSetting(SETTINGS.SEARCH_PROVIDER, provider)),
  setLbrySearchUrl: (url) => dispatch(doSetClientSetting(SETTINGS.LBRY_SEARCH_URL, url)),
});

export default connect(select, perform)(SettingSearchServer);
