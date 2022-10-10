import { connect } from 'react-redux';
import InvitedPage from './view';
import { selectPermanentUrlForUri } from 'redux/selectors/claims';
import { withRouter } from 'react-router';
import { doResolveUri } from 'redux/actions/claims';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { referrer } = params;
  const uri = `lbry://${referrer}`;

  return {
    uri,
    referrerUri: selectPermanentUrlForUri(state, uri),
  };
};

const perform = {
  doResolveUri,
};

export default withRouter(connect(select, perform)(InvitedPage));
