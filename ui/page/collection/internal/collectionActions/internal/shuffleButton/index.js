import { connect } from 'react-redux';
import { doToggleShuffleList } from 'redux/actions/content';
import { selectListShuffleForId } from 'redux/selectors/content';
import ShuffleButton from './view';

const select = (state, props) => {
  const { collectionId } = props;

  const shuffleList = selectListShuffleForId(state, collectionId);
  const uri = shuffleList && shuffleList.newUrls[0];

  return {
    uri,
  };
};

const perform = {
  doToggleShuffleList,
};

export default connect(select, perform)(ShuffleButton);
