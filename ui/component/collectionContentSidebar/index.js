import { connect } from 'react-redux';
import CollectionContent from './view';
import {
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
  makeSelectCollectionForId,
  makeSelectClaimForClaimId,
  makeSelectClaimIsMine,
} from 'lbry-redux';

const select = (state, props) => {
  const claim = makeSelectClaimForClaimId(props.id)(state);
  const url = claim && claim.permanent_url;

  return {
    collection: makeSelectCollectionForId(props.id)(state),
    collectionUrls: makeSelectUrlsForCollectionId(props.id)(state),
    collectionName: makeSelectNameForCollectionId(props.id)(state),
    claim,
    isMine: makeSelectClaimIsMine(url)(state),
  };
};

export default connect(select)(CollectionContent);
