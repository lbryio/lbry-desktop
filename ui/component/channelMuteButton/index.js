import { connect } from 'react-redux';
import { doChannelMute, doChannelUnmute } from 'redux/actions/blocked';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import ChannelMuteButton from './view';

const select = (state, props) => ({
  isMuted: makeSelectChannelIsMuted(props.uri)(state),
});

export default connect(select, {
  doChannelMute,
  doChannelUnmute,
})(ChannelMuteButton);
