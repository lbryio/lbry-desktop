import { connect } from 'react-redux';
import PremiumBadge from './view';
import { selectOdyseeMembershipForUri } from 'redux/selectors/claims';

const select = (state, props) => ({
  membership: props.uri ? selectOdyseeMembershipForUri(state, props.uri) : props.membership,
});

export default connect(select)(PremiumBadge);
