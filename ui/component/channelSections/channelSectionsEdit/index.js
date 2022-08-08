import ChannelSectionsEdit from './view';
import { connect } from 'react-redux';
import { makeSelectCoverForUri, selectClaimForUri } from 'redux/selectors/claims';
import { getClaimTitle, getThumbnailFromClaim } from 'util/claim';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    title: getClaimTitle(claim),
    thumbnailUrl: getThumbnailFromClaim(claim),
    coverUrl: makeSelectCoverForUri(props.uri)(state),
  };
};

export default connect(select)(ChannelSectionsEdit);
