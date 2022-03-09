import { connect } from 'react-redux';
import fileViewerEmbeddedTitle from './view';
import { makeSelectTagInClaimOrChannelForUri, selectTitleForUri } from 'redux/selectors/claims';
import { PREFERENCE_EMBED } from 'constants/tags';

export default connect((state, props) => {
  return {
    title: selectTitleForUri(state, props.uri),
    preferEmbed: makeSelectTagInClaimOrChannelForUri(props.uri, PREFERENCE_EMBED)(state),
  };
})(fileViewerEmbeddedTitle);
