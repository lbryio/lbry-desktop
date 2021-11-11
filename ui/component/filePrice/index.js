import { connect } from 'react-redux';
import { selectClaimForUri, makeSelectClaimWasPurchased, selectClaimIsMine } from 'redux/selectors/claims';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri, makeSelectFetchingCostInfoForUri } from 'lbryinc';
import FilePrice from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    fetching: makeSelectFetchingCostInfoForUri(props.uri)(state),
  };
};

export default connect(select, { doFetchCostInfoForUri })(FilePrice);
