import { connect } from 'react-redux';
import { makeSelectClaimIsPending } from 'redux/selectors/claims';
import { doOpenModal } from 'redux/actions/app';
import CollectionDeleteButton from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    claimIsPending: makeSelectClaimIsPending(uri)(state),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(CollectionDeleteButton);
