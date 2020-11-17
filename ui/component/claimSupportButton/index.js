import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { makeSelectTagInClaimOrChannelForUri } from 'lbry-redux';
import ClaimSupportButton from './view';

const DISABLE_SUPPORT_TAG = 'disable-support';
const select = (state, props) => ({
  disableSupport: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_SUPPORT_TAG)(state),
});

export default connect(select, {
  doOpenModal,
})(ClaimSupportButton);
