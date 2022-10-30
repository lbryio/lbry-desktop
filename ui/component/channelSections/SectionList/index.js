import SectionList from './view';
import { connect } from 'react-redux';

import { doOpenModal } from 'redux/actions/app';
import { doFetchCreatorSettings } from 'redux/actions/comments';

import { selectClaimIdForUri } from 'redux/selectors/claims';
import {
  selectFeaturedChannelsForChannelId,
  selectFetchingCreatorSettings,
  selectSettingsForChannelId,
} from 'redux/selectors/comments';

const select = (state, props) => {
  const claimId = selectClaimIdForUri(state, props.uri);

  return {
    claimId,
    creatorSettings: selectSettingsForChannelId(state, claimId),
    featuredChannels: selectFeaturedChannelsForChannelId(state, claimId),
    fetchingCreatorSettings: selectFetchingCreatorSettings(state),
  };
};

const perform = {
  doOpenModal,
  doFetchCreatorSettings,
};

export default connect(select, perform)(SectionList);
