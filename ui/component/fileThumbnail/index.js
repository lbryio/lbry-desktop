import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectContentWatchedPercentageForUri } from 'redux/selectors/content';
import CardMedia from './view';

const select = (state, props) => {
  return {
    watchedPercentage: makeSelectContentWatchedPercentageForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
  };
};

export default connect(select, { doResolveUri })(CardMedia);
