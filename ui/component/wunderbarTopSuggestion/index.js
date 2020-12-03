import { connect } from 'react-redux';
import { doResolveUris, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import WunderbarTopSuggestion from './view';

const select = (state, props) => {
  const winningUri = makeSelectWinningUriForQuery(props.query)(state);
  const winningClaim = winningUri ? makeSelectClaimForUri(winningUri)(state) : undefined;

  return { winningUri, winningClaim };
};

export default connect(select, {
  doResolveUris,
})(WunderbarTopSuggestion);
