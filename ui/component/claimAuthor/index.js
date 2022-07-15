import { connect } from 'react-redux';
import { selectChannelForClaimUri } from 'redux/selectors/claims';
import ClaimAuthor from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    channelUri: selectChannelForClaimUri(state, uri),
  };
};

export default connect(select)(ClaimAuthor);
