import { connect } from 'react-redux';
import FormNewCollection from './view';
import { doPlaylistAddAndAllowPlaying } from 'redux/actions/content';
import { selectCollectionForId } from 'redux/selectors/collections';

const select = (state, props) => {
  const { sourceId } = props;

  return {
    sourceCollectionName: sourceId && selectCollectionForId(state, sourceId).name,
  };
};

const perform = {
  doPlaylistAddAndAllowPlaying,
};

export default connect(select, perform)(FormNewCollection);
