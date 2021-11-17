import { connect } from 'react-redux';
import InvitedPage from './view';
import { selectPermanentUrlForUri } from 'redux/selectors/claims';
import { withRouter } from 'react-router';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { referrer } = params;
  const sanitizedReferrer = referrer ? referrer.replace(':', '#') : '';
  const uri = `lbry://${sanitizedReferrer}`;
  return {
    fullUri: selectPermanentUrlForUri(state, uri),
    referrer: referrer,
  };
};
const perform = () => ({});

export default withRouter(connect(select, perform)(InvitedPage));
