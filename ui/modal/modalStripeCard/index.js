import { connect } from 'react-redux';
import { doOpenModal, doHideModal } from 'redux/actions/app';
import { selectHasSavedCard } from 'redux/selectors/stripe';

import ModalStripeCard from './view';

const select = (state) => ({
  hasSavedCard: selectHasSavedCard(state),
});

const perform = {
  doOpenModal,
  doHideModal,
};

export default connect(select, perform)(ModalStripeCard);
