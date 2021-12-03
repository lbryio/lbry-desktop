import { connect } from 'react-redux';
import { selectIsUriResolving } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import ChannelMentionTopSuggestion from './view';

const select = (state, props) => {
  const uriFromQuery = `lbry://${props.query}`;
  return {
    uriFromQuery,
    isResolvingUri: selectIsUriResolving(state, uriFromQuery),
    winningUri: makeSelectWinningUriForQuery(props.query)(state),
  };
};

export default connect(select, { doResolveUri })(ChannelMentionTopSuggestion);
