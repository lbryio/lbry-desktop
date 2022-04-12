import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import CardMedia from './view';

const select = (state, props) => ({
  position: makeSelectContentPositionForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, { doResolveUri })(CardMedia);
