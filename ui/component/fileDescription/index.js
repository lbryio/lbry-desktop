import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMine } from 'redux/selectors/claims';
import { makeSelectPendingAmountByUri } from 'redux/selectors/wallet';
import { doOpenModal } from 'redux/actions/app';
import FileDescription from './view';
import { getClaimMetadata } from 'util/claim';

const select = (state, props) => {
  const { uri } = props;

  const pendingAmount = makeSelectPendingAmountByUri(uri)(state);

  const claim = selectClaimForUri(state, uri);
  const metadata = getClaimMetadata(claim);
  const description = metadata && metadata.description;
  const amount = claim ? parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount) : 0;
  const hasSupport = claim && claim.meta && claim.meta.support_amount && Number(claim.meta.support_amount) > 0;

  const isEmpty = !claim || !metadata;

  return {
    claimIsMine: selectClaimIsMine(state, claim),
    description,
    amount,
    hasSupport,
    isEmpty,
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(FileDescription);
