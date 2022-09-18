import { connect } from 'react-redux';
import { selectClaimIsPendingForId } from 'redux/selectors/claims';
import { doOpenModal } from 'redux/actions/app';
import CollectionDeleteButton from './view';

const select = (state, props) => {
  const { collectionId } = props;

  return {
    claimIsPending: selectClaimIsPendingForId(state, collectionId),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(CollectionDeleteButton);
