import { connect } from 'react-redux';
import { selectCardDetails } from 'redux/selectors/stripe';

import SettingsStripeCardPage from './view';

const select = (state) => ({
  cardDetails: selectCardDetails(state),
});

export default connect(select)(SettingsStripeCardPage);
