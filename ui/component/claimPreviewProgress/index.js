import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectContentPositionForUri } from 'redux/selectors/content';
import ClaimPreviewProgress from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);
  return {
    position: selectContentPositionForUri(state, props.uri),
    duration: claim?.value?.video?.duration || claim?.value?.audio?.duration,
  };
};

export default connect(select)(ClaimPreviewProgress);
