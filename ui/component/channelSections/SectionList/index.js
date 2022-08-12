import SectionList from './view';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doClaimSearch } from 'redux/actions/claims';
import { doFetchItemsInCollections, doPublishFeaturedChannels } from 'redux/actions/collections';
import { selectClaimIdForUri, selectClaimSearchByQuery, selectIsFetchingMyCollections } from 'redux/selectors/claims';
import {
  selectFeaturedChannelsByChannelId,
  selectFeaturedChannelsPublishing,
  selectMyEditedCollections,
  selectMyUnpublishedCollections,
} from 'redux/selectors/collections';
import { selectHasOdyseeMembership } from 'redux/selectors/user';

const select = (state, props) => {
  return {
    claimId: selectClaimIdForUri(state, props.uri),
    featuredChannelsByChannelId: selectFeaturedChannelsByChannelId(state),
    claimSearchByQuery: selectClaimSearchByQuery(state),
    myUnpublishedCollections: selectMyUnpublishedCollections(state),
    myEditedCollections: selectMyEditedCollections(state),
    isPublishing: selectFeaturedChannelsPublishing(state),
    isFetchingMyCollections: selectIsFetchingMyCollections(state),
    hasMembership: selectHasOdyseeMembership(state),
  };
};

const perform = {
  doOpenModal,
  doClaimSearch,
  doFetchItemsInCollections,
  doPublishFeaturedChannels,
};

export default connect(select, perform)(SectionList);
