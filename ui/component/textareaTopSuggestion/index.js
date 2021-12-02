import { connect } from 'react-redux';
import { selectIsUriResolving } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import TextareaTopSuggestion from './view';

const select = (state, props) => {
  const uriFromQuery = `lbry://${props.query}`;

  return {
    isResolvingUri: selectIsUriResolving(state, uriFromQuery),
    uriFromQuery,
    winningUri: makeSelectWinningUriForQuery(props.query)(state),
  };
};

export default connect(select, { doResolveUri })(TextareaTopSuggestion);
