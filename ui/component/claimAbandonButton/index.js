import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import ClaimAbandonButton from './view';

import { makeSelectClaimForUri } from 'lbry-redux';

const select = (state, props) => ({
  claim: props.uri && makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, {
  doOpenModal,
})(ClaimAbandonButton);
