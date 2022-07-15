import { connect } from 'react-redux';
import ShuffleButton from './view';
import { selectListIsShuffledForId } from 'redux/selectors/content';
import { doToggleShuffleList } from 'redux/actions/content';

const select = (state, props) => {
  const { id: collectionId } = props;

  return {
    shuffle: selectListIsShuffledForId(state, collectionId),
  };
};

const perform = {
  doToggleShuffleList,
};

export default connect(select, perform)(ShuffleButton);
