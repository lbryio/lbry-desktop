import { connect } from 'react-redux';
import { doChannelMute, doChannelUnmute } from 'redux/actions/blocked';
import ChannelMuteButton from './view';

const select = () => ({
  isMuted: false,
});

export default connect(select, {
  doChannelMute,
  doChannelUnmute,
})(ChannelMuteButton);
