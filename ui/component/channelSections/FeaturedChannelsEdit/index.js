import FeaturedChannelsEdit from './view';
import { connect } from 'react-redux';

import { doUpdateCreatorSettings } from 'redux/actions/comments';
import { doToast } from 'redux/actions/notifications';
import { selectClaimForClaimId } from 'redux/selectors/claims';
import { selectFeaturedChannelsForChannelId, selectSectionsForChannelId } from 'redux/selectors/comments';

const DEFAULT_SECTION = {
  version: '1.0',
  entries: [],
};

const select = (state, props) => ({
  sections: selectSectionsForChannelId(state, props.channelId) || DEFAULT_SECTION,
  featuredChannels: selectFeaturedChannelsForChannelId(state, props.channelId),
  channelClaim: selectClaimForClaimId(state, props.channelId),
});

const perform = {
  doUpdateCreatorSettings,
  doToast,
};

export default connect(select, perform)(FeaturedChannelsEdit);
