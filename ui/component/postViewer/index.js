import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectClaimIsMineForUri } from 'redux/selectors/claims';
import PostViewer from './view';
import { doOpenModal } from 'redux/actions/app';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: selectClaimIsMineForUri(state, props.uri),
});

export default connect(select, {
  doOpenModal,
})(PostViewer);
