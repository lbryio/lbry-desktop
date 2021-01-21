import { connect } from 'react-redux';
import { doSetPlayingUri } from 'redux/actions/content';
import LivestreamPage from './view';

const select = state => ({});

export default connect(select, {
  doSetPlayingUri,
})(LivestreamPage);
