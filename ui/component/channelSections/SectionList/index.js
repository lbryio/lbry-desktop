import SectionList from './view';
import { connect } from 'react-redux';

import { doOpenModal } from 'redux/actions/app';
import { doFetchCreatorSettings } from 'redux/actions/comments';

import { selectClaimIdForUri } from 'redux/selectors/claims';
import { selectUserHasValidOdyseeMembership } from 'redux/selectors/memberships';
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
    userHasOdyseeMembership: selectUserHasValidOdyseeMembership(state),
    fetchingCreatorSettings: selectFetchingCreatorSettings(state),
  };
};

const perform = {
  doOpenModal,
  doFetchCreatorSettings,
};

export default connect(select, perform)(SectionList);
