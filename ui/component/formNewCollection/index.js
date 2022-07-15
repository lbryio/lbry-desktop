import { connect } from 'react-redux';
import FormNewCollection from './view';
import { doPlaylistAddAndAllowPlaying } from 'redux/actions/content';

const perform = {
  doPlaylistAddAndAllowPlaying,
};

export default connect(null, perform)(FormNewCollection);
