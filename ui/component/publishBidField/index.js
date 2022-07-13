import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectIsResolvingPublishUris } from 'redux/selectors/publish';
import { selectTakeOverAmountForName } from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import PublishPage from './view';

const select = (state, props) => {
  const { params } = props;
  const { name } = params;

  return {
    balance: selectBalance(state),
    isResolvingUri: selectIsResolvingPublishUris(state),
    amountNeededForTakeover: selectTakeOverAmountForName(state, name),
  };
};

const perform = {
  doResolveUri,
};

export default connect(select, perform)(PublishPage);
