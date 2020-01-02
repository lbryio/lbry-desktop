import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import {
  doClaimSearch,
  selectClaimSearchByQuery,
  selectFetchingClaimSearch,
  doToggleTagFollow,
  selectBlockedChannels,
} from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ClaimListDiscover from './view';

const select = state => ({
  claimSearchByQuery: selectClaimSearchByQuery(state),
  loading: selectFetchingClaimSearch(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  hiddenUris: selectBlockedChannels(state),
});

const perform = {
  doClaimSearch,
  doToggleTagFollow,
};

export default connect(
  select,
  perform
)(ClaimListDiscover);
