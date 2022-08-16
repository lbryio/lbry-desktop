import { connect } from 'react-redux';
import { selectCardDetails } from 'redux/selectors/stripe';

import SettingsStripeCard from './view';

const select = (state) => ({
  cardDetails: selectCardDetails(state),
});

export default connect(select)(SettingsStripeCard);
