import ModalFeaturedChannelsSort from './view';
import { connect } from 'react-redux';

import { doHideModal } from 'redux/actions/app';
import { doUpdateCreatorSettings } from 'redux/actions/comments';

import { selectClaimForClaimId } from 'redux/selectors/claims';
import { selectSectionsForChannelId } from 'redux/selectors/comments';

const select = (state, props) => {
  return {
    sections: selectSectionsForChannelId(state, props.channelId),
    channelClaim: selectClaimForClaimId(state, props.channelId),
  };
};

const perform = {
  doUpdateCreatorSettings,
  doHideModal,
};

export default connect(select, perform)(ModalFeaturedChannelsSort);
