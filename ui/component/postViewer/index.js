import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsMine } from 'redux/selectors/claims';
import PostViewer from './view';
import { doOpenModal } from 'redux/actions/app';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

export default connect(select, {
  doOpenModal,
})(PostViewer);
