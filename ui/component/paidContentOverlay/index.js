import { connect } from 'react-redux';
import PaidContentOverlay from './view';
import { doOpenModal } from 'redux/actions/app';
import { selectRentalTagForUri } from 'redux/selectors/claims';

const select = (state, props) => {
  return {
    rentalTag: selectRentalTagForUri(state, props.uri),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(PaidContentOverlay);
