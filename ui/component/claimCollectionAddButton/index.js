import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import CollectionAddButton from './view';
import { makeSelectClaimForUri } from 'lbry-redux';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, {
  doOpenModal,
})(CollectionAddButton);
