import { connect } from 'react-redux';
import fileViewerEmbeddedTitle from './view';
import { makeSelectTitleForUri } from 'lbry-redux';

export default connect((state, props) => {
  return {
    title: makeSelectTitleForUri(props.uri)(state),
  };
})(fileViewerEmbeddedTitle);
