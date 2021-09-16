import { connect } from 'react-redux';
import fileViewerEmbeddedTitle from './view';
import { makeSelectTagInClaimOrChannelForUri, makeSelectTitleForUri } from 'lbry-redux';
import { PREFERENCE_EMBED } from 'constants/tags';

export default connect((state, props) => {
  return {
    title: makeSelectTitleForUri(props.uri)(state),
    preferEmbed: makeSelectTagInClaimOrChannelForUri(props.uri, PREFERENCE_EMBED)(state),
  };
})(fileViewerEmbeddedTitle);
