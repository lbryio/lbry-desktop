import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import CreatorDashboardPage from './view';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

const perform = dispatch => ({
  openChannelCreateModal: () => dispatch(doOpenModal(MODALS.CREATE_CHANNEL)),
});

export default connect(select, perform)(CreatorDashboardPage);
