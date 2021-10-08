import { connect } from 'react-redux';
import { makeSelectNsfwCountFromUris, makeSelectOmittedCountForChannel } from 'redux/selectors/claims';
import { parseURI } from 'util/lbryURI';
import { selectShowMatureContent } from 'redux/selectors/settings';
import HiddenNsfwClaims from './view';

const select = (state, props) => {
  const { uri, uris } = props;

  let numberOfHiddenClaims;
  if (uri) {
    const { isChannel } = parseURI(uri);
    numberOfHiddenClaims = isChannel
      ? makeSelectOmittedCountForChannel(uri)(state)
      : makeSelectNsfwCountFromUris([uri])(state);
  } else if (uris) {
    numberOfHiddenClaims = makeSelectNsfwCountFromUris(uris)(state);
  }

  return {
    numberOfHiddenClaims,
    obscureNsfw: !selectShowMatureContent(state),
  };
};

const perform = () => ({});

export default connect(select, perform)(HiddenNsfwClaims);
