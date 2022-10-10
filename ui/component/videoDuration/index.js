import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import VideoDuration from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, null)(VideoDuration);
