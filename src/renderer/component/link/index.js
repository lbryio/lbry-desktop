import { connect } from 'react-redux';
import { doNavigate } from 'lbry-redux';
import Link from './view';

const perform = dispatch => ({
  doNavigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(null, perform)(Link);
