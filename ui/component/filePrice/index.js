import { connect } from 'react-redux';
import { selectClaimForUri, makeSelectClaimWasPurchased, selectClaimIsMine } from 'redux/selectors/claims';
import { selectCostInfoForUri, doFetchCostInfoForUri, selectFetchingCostInfoForUri } from 'lbryinc';
import FilePrice from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
    costInfo: selectCostInfoForUri(state, props.uri),
    fetching: selectFetchingCostInfoForUri(state, props.uri),
  };
};

export default connect(select, { doFetchCostInfoForUri })(FilePrice);
