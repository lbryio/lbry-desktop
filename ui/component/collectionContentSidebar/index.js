import { connect } from 'react-redux';
import CollectionContent from './view';
import {
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
  makeSelectCollectionForId,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
} from 'lbry-redux';
import { selectPlayingUri, selectListLoop, selectListShuffle } from 'redux/selectors/content';
import { doToggleLoopList, doToggleShuffleList } from 'redux/actions/content';

const select = (state, props) => {
  const playingUri = selectPlayingUri(state);
  const playingUrl = playingUri && playingUri.uri;
  const claim = makeSelectClaimForUri(playingUrl)(state);
  const url = claim && claim.permanent_url;
  const loopList = selectListLoop(state);
  const loop = loopList && loopList.collectionId === props.id && loopList.loop;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === props.id && shuffleList.newUrls;

  return {
    url,
    collection: makeSelectCollectionForId(props.id)(state),
    collectionUrls: makeSelectUrlsForCollectionId(props.id)(state),
    collectionName: makeSelectNameForCollectionId(props.id)(state),
    isMine: makeSelectClaimIsMine(url)(state),
    loop,
    shuffle,
  };
};

export default connect(select, {
  doToggleLoopList,
  doToggleShuffleList,
})(CollectionContent);
