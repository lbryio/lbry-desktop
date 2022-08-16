import { connect } from 'react-redux';
import { doOpenModal, doHideModal } from 'redux/actions/app';

import SettingsStripeCard from './view';

const perform = {
  doOpenModal,
  doHideModal,
};

export default connect(null, perform)(SettingsStripeCard);
