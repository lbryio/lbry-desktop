import { connect } from 'react-redux';
import { selectCollectionForId, selectCollectionForIdHasClaimUrl } from 'redux/selectors/collections';
import { makeSelectClaimIsPending } from 'redux/selectors/claims';
import { doPlaylistAddAndAllowPlaying } from 'redux/actions/content';
import CollectionSelectItem from './view';

const select = (state, props) => {
  const { collectionId, uri } = props;

  return {
    collection: selectCollectionForId(state, collectionId),
    collectionHasClaim: selectCollectionForIdHasClaimUrl(state, collectionId, uri),
    collectionPending: makeSelectClaimIsPending(collectionId)(state),
  };
};

const perform = {
  doPlaylistAddAndAllowPlaying,
};

export default connect(select, perform)(CollectionSelectItem);
