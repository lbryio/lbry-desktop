import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectClaimRepostedAmountForUri } from 'redux/selectors/claims';
import ClaimRepostButton from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    repostedAmount: selectClaimRepostedAmountForUri(state, uri),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(ClaimRepostButton);
