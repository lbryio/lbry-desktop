import { connect } from 'react-redux';
import { selectPreferredCurrency } from 'redux/selectors/settings';

import MembershipSplash from './view';

const select = (state) => ({
  preferredCurrency: selectPreferredCurrency(state),
});

export default connect(select)(MembershipSplash);
