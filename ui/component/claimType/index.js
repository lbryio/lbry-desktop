import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsStreamPlaceholder } from 'redux/selectors/claims';
import FileType from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
});

export default connect(select)(FileType);
