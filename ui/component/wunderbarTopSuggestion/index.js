import { connect } from 'react-redux';
import { doResolveUris, makeSelectClaimForUri, makeSelectIsUriResolving, parseURI } from 'lbry-redux';
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import WunderbarTopSuggestion from './view';

const select = (state, props) => {
  const uriFromQuery = `lbry://${props.query}`;

  let uris = [uriFromQuery];
  let channelUriFromQuery;
  try {
    const { isChannel } = parseURI(uriFromQuery);

    if (!isChannel) {
      channelUriFromQuery = `lbry://@${props.query}`;
      uris.push(channelUriFromQuery);
    }
  } catch (e) {}

  const resolvingUris = uris.some(uri => makeSelectIsUriResolving(uri)(state));
  const winningUri = makeSelectWinningUriForQuery(props.query)(state);
  const winningClaim = winningUri ? makeSelectClaimForUri(winningUri)(state) : undefined;

  return { resolvingUris, winningUri, winningClaim, uris };
};

export default connect(select, {
  doResolveUris,
})(WunderbarTopSuggestion);
