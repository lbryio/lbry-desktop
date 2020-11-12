import { connect } from 'react-redux';
import { doResolveUris } from 'lbry-redux';
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import SearchTopClaim from './view';

const select = (state, props) => ({
  winningUri: makeSelectWinningUriForQuery(props.query)(state),
});

export default connect(select, {
  doResolveUris,
})(SearchTopClaim);
