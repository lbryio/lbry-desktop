import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { makeSelectClaimForClaimId } from 'redux/selectors/claims';
import TransactionListTableItem from './view';

const select = (state, props) => {
  const claimId = props.txo && props.txo.signing_channel && props.txo.signing_channel.channel_id;
  return {
    signingChannel: makeSelectClaimForClaimId(claimId)(state),
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(TransactionListTableItem);
