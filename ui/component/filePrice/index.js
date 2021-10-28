import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimWasPurchased, makeSelectClaimIsMine } from 'redux/selectors/claims';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri, makeSelectFetchingCostInfoForUri } from 'lbryinc';
import FilePrice from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fetching: makeSelectFetchingCostInfoForUri(props.uri)(state),
});

export default connect(select, { doFetchCostInfoForUri })(FilePrice);
