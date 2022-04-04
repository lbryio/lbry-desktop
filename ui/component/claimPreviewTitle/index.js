import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import ClaimPreviewTitle from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: selectTitleForUri(state, props.uri),
});

export default connect(select)(ClaimPreviewTitle);
