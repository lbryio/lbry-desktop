import SectionList from './view';
import { connect } from 'react-redux';

import { doOpenModal } from 'redux/actions/app';

import { selectClaimIdForUri } from 'redux/selectors/claims';
import { selectFeaturedChannelsForChannelId, selectFetchingCreatorSettings } from 'redux/selectors/comments';

const select = (state, props) => {
  const claimId = selectClaimIdForUri(state, props.uri);

  return {
    claimId,
    featuredChannels: selectFeaturedChannelsForChannelId(state, claimId),
    fetchingCreatorSettings: selectFetchingCreatorSettings(state),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(SectionList);
