import Section from './view';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doDeleteChannelSection } from 'redux/actions/comments';
import { selectClaimIsMineForId } from 'redux/selectors/claims';

const select = (state, props) => {
  return {
    isChannelMine: selectClaimIsMineForId(state, props.channelId),
  };
};

const perform = {
  doOpenModal,
  doDeleteChannelSection,
};

export default connect(select, perform)(Section);
