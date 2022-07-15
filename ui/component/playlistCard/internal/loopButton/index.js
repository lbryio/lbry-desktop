import { connect } from 'react-redux';
import LoopButton from './view';
import { selectListIsLoopedForId } from 'redux/selectors/content';
import { doToggleLoopList } from 'redux/actions/content';

const select = (state, props) => {
  const { id: collectionId } = props;

  return {
    loop: selectListIsLoopedForId(state, collectionId),
  };
};

const perform = {
  doToggleLoopList,
};

export default connect(select, perform)(LoopButton);
