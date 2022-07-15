import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectUrlsForCollectionId } from 'redux/selectors/collections';
import PlayButton from './view';

const select = (state, props) => {
  const { collectionId } = props;

  const collectionUrls = selectUrlsForCollectionId(state, collectionId);

  // this will help play the first valid claim in a list
  // in case the urls have been deleted
  const firstPlayableItem = collectionUrls?.find((url) => Boolean(selectClaimForUri(state, url)));

  return {
    uri: firstPlayableItem,
  };
};

export default connect(select)(PlayButton);
