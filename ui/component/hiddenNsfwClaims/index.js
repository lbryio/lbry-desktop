import { connect } from 'react-redux';
import { makeSelectNsfwCountForChannel, makeSelectNsfwCountFromUris, parseURI } from 'lbry-redux';
import { selectShowMatureContent } from 'redux/selectors/settings';
import HiddenNsfwClaims from './view';

const select = (state, props) => {
  const { uri, uris } = props;

  let numberOfNsfwClaims;
  if (uri) {
    const { isChannel } = parseURI(uri);
    numberOfNsfwClaims = isChannel
      ? makeSelectNsfwCountForChannel(uri)(state)
      : makeSelectNsfwCountFromUris([uri])(state);
  } else if (uris) {
    numberOfNsfwClaims = makeSelectNsfwCountFromUris(uris)(state);
  }

  return {
    numberOfNsfwClaims,
    obscureNsfw: !selectShowMatureContent(state),
  };
};

const perform = () => ({});

export default connect(
  select,
  perform
)(HiddenNsfwClaims);
