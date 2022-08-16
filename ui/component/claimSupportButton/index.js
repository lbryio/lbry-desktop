import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { makeSelectTagInClaimOrChannelForUri, selectClaimForUri } from 'redux/selectors/claims';
import ClaimSupportButton from './view';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { selectCanReceiveFiatTipsForUri } from 'redux/selectors/stripe';
import { doTipAccountCheckForUri } from 'redux/actions/stripe';

const DISABLE_SUPPORT_TAG = 'disable-support';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const isRepost = claim && claim.repost_url;

  return {
    disableSupport: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_SUPPORT_TAG)(state),
    isRepost,
    preferredCurrency: selectPreferredCurrency(state),
    canReceiveFiatTips: selectCanReceiveFiatTipsForUri(state, uri),
  };
};

const perform = {
  doOpenModal,
  doTipAccountCheckForUri,
};

export default connect(select, perform)(ClaimSupportButton);
