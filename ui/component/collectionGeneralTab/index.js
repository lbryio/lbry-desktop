import { connect } from 'react-redux';
import { selectChannelForUri } from 'redux/selectors/claims';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';

import CollectionGeneralTab from './view';

const select = (state, props) => {
  const { uri, isPrivateEdit } = props;

  return {
    collectionChannel: !isPrivateEdit && selectChannelForUri(state, uri),
    activeChannelClaim: !isPrivateEdit && selectActiveChannelClaim(state),
    incognito: selectIncognito(state),
  };
};

export default connect(select)(CollectionGeneralTab);
