import { connect } from 'react-redux';
import FeaturedChannelsPage from './view';

import { CHANNEL_SECTIONS_QUERIES as CSQ } from 'constants/urlParams';
import { doFetchCreatorSettings } from 'redux/actions/comments';
import {
  selectFeaturedChannelsForChannelId,
  selectFetchingCreatorSettings,
  selectSettingsForChannelId,
} from 'redux/selectors/comments';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const claimId = urlParams.get(CSQ.CLAIM_ID);
  const sectionId = urlParams.get(CSQ.SECTION_ID);

  return {
    claimId,
    sectionId,
    creatorSettingsFetched: selectSettingsForChannelId(state, claimId) !== undefined,
    fetchingCreatorSettings: selectFetchingCreatorSettings(state),
    featuredChannels: selectFeaturedChannelsForChannelId(state, claimId),
  };
};

const perform = {
  doFetchCreatorSettings,
};

export default connect(select, perform)(FeaturedChannelsPage);
